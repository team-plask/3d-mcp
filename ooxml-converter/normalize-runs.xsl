<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs w">

    <xsl:output method="xml" indent="no" omit-xml-declaration="yes"/>
    <xsl:strip-space elements="*"/>

    <!-- ========== <w:rPr> 비교 함수 ========== -->
    <xsl:function name="w:get-significant-rpr-fingerprint" as="xs:string">
        <xsl:param name="rPr" as="element(w:rPr)?"/>
        <xsl:variable name="fingerprint" as="xs:string*">
            <xsl:if test="$rPr">
                <!-- 굵게 -->
                <xsl:sequence select="if (exists($rPr/w:b[not(@w:val='0') or not(@w:val)])) then 'b:true' else 'b:false'"/>
                <!-- 기울임 -->
                <xsl:sequence select="if (exists($rPr/w:i[not(@w:val='0') or not(@w:val)])) then 'i:true' else 'i:false'"/>
                <!-- 밑줄 (종류까지 비교) -->
                <xsl:sequence select="concat('u:', normalize-space(string($rPr/w:u/@w:val)))"/>
                <!-- 글자 크기 -->
                <xsl:sequence select="concat('sz:', normalize-space(string($rPr/w:sz/@w:val)))"/>
                <xsl:sequence select="concat('szCs:', normalize-space(string($rPr/w:szCs/@w:val)))"/>
                <!-- 글자 색 -->
                <xsl:sequence select="concat('color:', normalize-space(string($rPr/w:color/@w:val)))"/>
                <!-- 글꼴 (핵심 속성만) -->
                <xsl:sequence select="concat('fontAscii:', normalize-space(string($rPr/w:rFonts/@w:ascii)))"/>
                <xsl:sequence select="concat('fontHAnsi:', normalize-space(string($rPr/w:rFonts/@w:hAnsi)))"/>
                <xsl:sequence select="concat('fontEastAsia:', normalize-space(string($rPr/w:rFonts/@w:eastAsia)))"/>
                <xsl:sequence select="concat('fontCs:', normalize-space(string($rPr/w:rFonts/@w:cs)))"/>
                <!-- 여기에 다른 중요한 스타일 속성들을 추가 (예: w:vertAlign, w:strike 등) -->
            </xsl:if>
        </xsl:variable>
        <xsl:sequence select="string-join($fingerprint, '|')"/>
    </xsl:function>

    <xsl:function name="w:are-rPr-equivalent" as="xs:boolean">
        <xsl:param name="rPr1" as="element(w:rPr)?"/>
        <xsl:param name="rPr2" as="element(w:rPr)?"/>
        <xsl:sequence select="w:get-significant-rpr-fingerprint($rPr1) eq w:get-significant-rpr-fingerprint($rPr2)"/>
    </xsl:function>

    <!-- ========== 기본 템플릿: 모든 노드와 속성 복사 ========== -->
    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>

    <!-- ========== <w:p> 요소 처리: 텍스트 실행 병합 ========== -->
    <xsl:template match="w:p">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:copy-of select="w:pPr"/> <!-- 단락 속성은 그대로 복사 -->
            
            <!-- 
                <w:p>의 자식 노드 중 병합 가능한 텍스트 실행들을 그룹화합니다.
                <w:proofErr>는 이미 제거된 것으로 간주하거나, 여기서 명시적으로 제외합니다.
                병합을 중단시키는 요소 (예: <w:br/>, 그림, 탭 등)를 기준으로 그룹을 나눕니다.
            -->
            <xsl:for-each-group select="node()[not(self::w:pPr or self::w:bookmarkStart or self::w:bookmarkEnd or self::w:commentRangeStart or self::w:commentRangeEnd or self::w:permStart or self::w:permEnd)]"
                                group-ending-with="*[self::w:br or self::w:tab or self::w:drawing or self::w:pict or self::w:sym or self::w:pgNum or self::w:softHyphen or self::w:cr or self::w:noBreakHyphen or self::w:lastRenderedPageBreak or self::w:instrText[normalize-space(.) != ''] or self::w:footnoteReference or self::w:endnoteReference or self::w:annotationRef]">
                
                <!-- 현재 그룹 내에서 다시 한번 실제 <w:r> 또는 <w:hyperlink>/<w:r> 등 텍스트 컨테이너만 필터링하여 연속된 스타일 그룹핑 -->
                <xsl:for-each-group select="current-group()[self::w:r or self::w:hyperlink or self::w:smartTag]"
                                    group-adjacent="w:get-significant-rpr-fingerprint((self::w:r/w:rPr | self::w:hyperlink/w:r[1]/w:rPr | self::w:smartTag/w:r[1]/w:rPr)[1])">
                    <xsl:variable name="current-runs" select="current-group()"/>
                    <xsl:variable name="first-node" select="$current-runs[1]"/>
                    
                    <xsl:choose>
                        <xsl:when test="count($current-runs) > 1">
                            <!-- 여러 개의 <w:r> 등을 하나로 병합 -->
                            <xsl:variable name="merged-text-value" select="normalize-space(string-join($current-runs/(self::w:r/w:t | self::w:hyperlink/w:r/w:t | self::w:smartTag/w:r/w:t)/text(), ''))"/>

                            <xsl:choose>
                                <xsl:when test="$first-node[self::w:r]">
                                    <w:r>
                                        <xsl:apply-templates select="$first-node/@*"/>
                                        <xsl:copy-of select="$first-node/w:rPr"/>
                                        <w:t xml:space="preserve"><xsl:value-of select="$merged-text-value"/></w:t>
                                        <!-- 첫 번째 w:r에서 다른 자식 노드들(텍스트나 rPr가 아니며 그룹 구분자도 아닌 경우) 복사 -->
                                        <xsl:apply-templates select="$first-node/node()[not(self::w:rPr or self::w:t)]"/>
                                    </w:r>
                                </xsl:when>
                                <xsl:when test="$first-node[self::w:hyperlink or self::w:smartTag]">
                                    <xsl:element name="{name($first-node)}" namespace="{namespace-uri($first-node)}">
                                        <xsl:apply-templates select="$first-node/@*"/>
                                        <xsl:variable name="original-rPr-for-style" select="$first-node/w:r[1]/w:rPr"/>
                                        <w:r>
                                            <xsl:copy-of select="$original-rPr-for-style"/>
                                            <w:t xml:space="preserve"><xsl:value-of select="$merged-text-value"/></w:t>
                                        </w:r>
                                        <!-- hyperlink/smartTag의 다른 자식 노드들 (방금 대체한 w:r 제외) 복사 -->
                                        <xsl:apply-templates select="$first-node/node()[not(self::w:r)]"/>
                                    </xsl:element>
                                </xsl:when>
                                <xsl:otherwise>
                                     <!-- 이론적으로 이 경우는 발생하지 않아야 하지만, 안전장치로 추가 -->
                                     <xsl:apply-templates select="$current-runs"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:when>
                        <xsl:otherwise>
                            <!-- 단일 <w:r> 또는 병합 불가능한 요소는 그대로 복사 -->
                            <xsl:apply-templates select="$current-runs"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:for-each-group>
                
                <!-- 그룹을 중단시킨 요소 (예: <w:br/>)가 있다면 그것도 출력 -->
                <xsl:apply-templates select="current-group()[self::w:br or self::w:tab or self::w:drawing or self::w:pict or self::w:sym or self::w:pgNum or self::w:softHyphen or self::w:cr or self::w:noBreakHyphen or self::w:lastRenderedPageBreak or self::w:instrText[normalize-space(.) != ''] or self::w:footnoteReference or self::w:endnoteReference or self::w:annotationRef]"/>
            </xsl:for-each-group>
            
            <!-- <w:p> 내의 다른 주요 구조적 요소들 (예: 북마크) -->
            <xsl:apply-templates select="w:bookmarkStart | w:bookmarkEnd | w:commentRangeStart | w:commentRangeEnd | w:permStart | w:permEnd"/>
        </xsl:copy>
    </xsl:template>

    <!-- ========== 불필요한 요소 및 속성 제거 ========== -->
    <xsl:template match="w:proofErr | @w:*[starts-with(local-name(), 'rsid')] | w:delText | w:ins | w:moveTo | w:moveFrom"/>
    <xsl:template match="w:rPrChange | w:pPrChange"/>
    <xsl:template match="w:commentReference"/> <!-- 댓글 내용이 아닌 참조 마크만 제거 -->
    <!-- 빈 <w:instrText> (필드 코드 결과가 없는 경우) 제거 -->
    <xsl:template match="w:instrText[normalize-space(.) = '']"/>
    <!-- 의미 없는 빈 <w:r> 제거 (예: <w:rPr>만 있고 <w:t>나 다른 내용이 없는 경우) -->
    <xsl:template match="w:r[not(node()[not(self::w:rPr)])]"/>

</xsl:stylesheet>