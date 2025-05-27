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

    <!-- ========== <w:p> 요소 처리: 레거시와 동일하게 ========== -->
    <xsl:template match="w:p">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:copy-of select="w:pPr"/> 
            
            <xsl:call-template name="process-paragraph-children">
                <xsl:with-param name="nodes" select="node()[not(self::w:pPr or self::w:bookmarkStart or self::w:bookmarkEnd or self::w:commentRangeStart or self::w:commentRangeEnd or self::w:permStart or self::w:permEnd or self::w:proofErr or self::w:delText or self::w:ins or self::w:moveTo or self::w:moveFrom or self::w:commentReference or self::w:instrText[normalize-space(.) = ''])]"/>
            </xsl:call-template>
            
            <xsl:apply-templates select="w:bookmarkStart | w:bookmarkEnd | w:commentRangeStart | w:commentRangeEnd | w:permStart | w:permEnd"/>
        </xsl:copy>
    </xsl:template>

    <!-- ========== <w:sdt> 요소 처리 ========== -->
    <!-- 블록 레벨 sdt (내부에 p가 있거나, p의 조상이 아닌 경우)는 구조 유지하고 내부 컨텐츠를 apply-templates로 처리 -->
    <xsl:template match="w:sdt[w:sdtContent/w:p or not(ancestor::w:p)]">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:copy-of select="w:sdtPr | w:sdtEndPr"/>
            <w:sdtContent>
                <xsl:apply-templates select="w:sdtContent/node()"/>
            </w:sdtContent>
        </xsl:copy>
    </xsl:template>
    
    <!-- 런 레벨 <w:sdt> (w:p 내부에 있고, 자신은 w:p를 포함하지 않음) -->
    <!-- 이 템플릿은 해당 SDT가 process-paragraph-children에 의해 직접 처리되지 않고 개별적으로 apply-templates될 때 호출됨 -->
    <xsl:template match="w:sdt[ancestor::w:p and not(w:sdtContent/w:p)]">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:copy-of select="w:sdtPr | w:sdtEndPr"/>
            <w:sdtContent>
                <!-- 런 레벨 SDT 내부의 자식들도 정규화 (런 병합 등) -->
                <xsl:call-template name="process-paragraph-children">
                    <xsl:with-param name="nodes" select="w:sdtContent/node()[not(self::w:proofErr or self::w:delText or self::w:ins or self::w:moveTo or self::w:moveFrom or self::w:commentReference or self::w:instrText[normalize-space(.) = ''])]"/>
                </xsl:call-template>
            </w:sdtContent>
        </xsl:copy>
    </xsl:template>

    <!-- <w:sdtContent>는 그 자체로 특별한 출력을 만들지 않음. 부모인 w:sdt 템플릿에서 처리 -->
    <xsl:template match="w:sdtContent"/>

    <!-- ========== 불필요한 요소 및 속성 제거 (레거시와 동일) ========== -->
    <xsl:template match="w:proofErr | @w:*[starts-with(local-name(), 'rsid')] | w:delText | w:ins | w:moveTo | w:moveFrom" priority="10"/>
    <xsl:template match="w:rPrChange | w:pPrChange" priority="10"/>
    <xsl:template match="w:commentReference" priority="10"/>
    <xsl:template match="w:instrText[normalize-space(.) = '']" priority="10"/>
    <xsl:template match="w:r[not(node()[not(self::w:rPr)])]" priority="10"/>

    <!-- ========== 명명된 템플릿: 단락(<w:p>) 또는 런 레벨 SDT 내부의 자식 노드들을 처리하여 런 병합 ========== -->
    <xsl:template name="process-paragraph-children">
        <xsl:param name="nodes" as="node()*"/>

        <xsl:for-each-group select="$nodes"
                            group-ending-with="*[self::w:br or self::w:tab or self::w:drawing or self::w:pict or self::w:sym or self::w:pgNum or self::w:softHyphen or self::w:cr or self::w:noBreakHyphen or self::w:lastRenderedPageBreak or self::w:instrText[normalize-space(.) != ''] or self::w:footnoteReference or self::w:endnoteReference or self::w:annotationRef or self::w:sdt[w:sdtContent/w:p or not(ancestor::w:p)]]">
            
            <xsl:variable name="current-segment" select="current-group()"/>

            <xsl:for-each-group select="$current-segment"
                                group-adjacent="w:get-significant-rpr-fingerprint( (self::w:r/w:rPr | self::w:hyperlink/w:r[1]/w:rPr | self::w:smartTag/w:r[1]/w:rPr | self::w:sdt[not(w:sdtContent/w:p)]/w:sdtContent/w:r[1]/w:rPr)[1] )">
                
                <xsl:variable name="current-runs-group" select="current-group()"/>
                <xsl:variable name="first-node-in-group" select="$current-runs-group[1]"/>
                
                <xsl:variable name="final-merged-text-nodes" as="node()*">
                    <xsl:for-each select="$current-runs-group">
                        <xsl:choose>
                            <xsl:when test=". instance of element(w:sdt) and not(w:sdtContent/w:p)">
                                <xsl:sequence select="w:sdtContent/w:r/w:t/node()"/>
                            </xsl:when>
                            <xsl:when test=". instance of element(w:r)">
                                <xsl:sequence select="w:t/node()"/>
                            </xsl:when>
                            <xsl:when test=". instance of element(w:hyperlink) or . instance of element(w:smartTag)">
                                <xsl:sequence select="w:r/w:t/node()"/>
                            </xsl:when>
                        </xsl:choose>
                    </xsl:for-each>
                </xsl:variable>
                <xsl:variable name="final-merged-text" select="string-join($final-merged-text-nodes, '')"/>
                
                <xsl:variable name="effective-rPr-of-first" select="($first-node-in-group/self::w:r/w:rPr |
                                                                     $first-node-in-group/self::w:hyperlink/w:r[1]/w:rPr |
                                                                     $first-node-in-group/self::w:smartTag/w:r[1]/w:rPr |
                                                                     $first-node-in-group/self::w:sdt[not(w:sdtContent/w:p)]/w:sdtContent/w:r[1]/w:rPr)[1]"/>

                <xsl:variable name="other-children-of-first-effective-run" select="($first-node-in-group/self::w:r/node()[not(self::w:rPr or self::w:t)] |
                                                                                   $first-node-in-group/self::w:sdt[not(w:sdtContent/w:p)]/w:sdtContent/w:r[1]/node()[not(self::w:rPr or self::w:t)])"/>

                <xsl:choose>
                    <xsl:when test="count($current-runs-group) > 1 and $final-merged-text != ''">
                        <xsl:choose>
                            <xsl:when test="$first-node-in-group[self::w:sdt and not(w:sdtContent/w:p)]">
                                <w:sdt>
                                    <xsl:apply-templates select="$first-node-in-group/@*"/>
                                    <xsl:copy-of select="$first-node-in-group/w:sdtPr"/>
                                    <w:sdtContent>
                                        <w:r>
                                            <xsl:copy-of select="$effective-rPr-of-first"/>
                                            <w:t xml:space="preserve"><xsl:value-of select="$final-merged-text"/></w:t>
                                            <xsl:copy-of select="$other-children-of-first-effective-run"/>
                                        </w:r>
                                    </w:sdtContent>
                                    <xsl:copy-of select="$first-node-in-group/w:sdtEndPr"/>
                                </w:sdt>
                            </xsl:when>
                            <xsl:when test="$first-node-in-group[self::w:r]">
                                <w:r>
                                    <xsl:apply-templates select="$first-node-in-group/@*"/>
                                    <xsl:copy-of select="$effective-rPr-of-first"/>
                                    <w:t xml:space="preserve"><xsl:value-of select="$final-merged-text"/></w:t>
                                    <xsl:copy-of select="$other-children-of-first-effective-run"/>
                                </w:r>
                            </xsl:when>
                            <xsl:when test="$first-node-in-group[self::w:hyperlink or self::w:smartTag]">
                                 <xsl:element name="{name($first-node-in-group)}" namespace="{namespace-uri($first-node-in-group)}">
                                    <xsl:apply-templates select="$first-node-in-group/@*"/>
                                    <w:r>
                                        <xsl:copy-of select="$effective-rPr-of-first"/>
                                        <w:t xml:space="preserve"><xsl:value-of select="$final-merged-text"/></w:t>
                                    </w:r>
                                    <xsl:apply-templates select="$first-node-in-group/node()[not(self::w:r)]"/>
                                </xsl:element>
                            </xsl:when>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:apply-templates select="$current-runs-group"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:for-each-group>
            
            <xsl:apply-templates select="$current-segment[last()][self::w:br or self::w:tab or self::w:drawing or self::w:pict or self::w:sym or self::w:pgNum or self::w:softHyphen or self::w:cr or self::w:noBreakHyphen or self::w:lastRenderedPageBreak or self::w:instrText[normalize-space(.) != ''] or self::w:footnoteReference or self::w:endnoteReference or self::w:annotationRef or self::w:sdt[w:sdtContent/w:p or not(ancestor::w:p)]]"/>
        </xsl:for-each-group>
    </xsl:template>

</xsl:stylesheet>