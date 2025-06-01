<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" 
    xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
    xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs w wp a pic r">

    <xsl:output method="xml" indent="no" omit-xml-declaration="yes"/>
    <xsl:strip-space elements="*"/>

    <xsl:function name="w:get-significant-rpr-fingerprint" as="xs:string">
        <xsl:param name="rPr" as="element(w:rPr)?"/>
        <xsl:variable name="fingerprint" as="xs:string*">
            <xsl:if test="$rPr">
                <xsl:sequence select="if (exists($rPr/w:b[not(@w:val='0') or not(@w:val)])) then 'b:true' else 'b:false'"/>
                <xsl:sequence select="if (exists($rPr/w:i[not(@w:val='0') or not(@w:val)])) then 'i:true' else 'i:false'"/>
                <xsl:sequence select="concat('u:', normalize-space(string($rPr/w:u/@w:val)))"/>
                <xsl:sequence select="concat('sz:', normalize-space(string($rPr/w:sz/@w:val)))"/>
                <xsl:sequence select="concat('szCs:', normalize-space(string($rPr/w:szCs/@w:val)))"/>
                <xsl:sequence select="concat('color:', normalize-space(string($rPr/w:color/@w:val)))"/>
                <xsl:sequence select="concat('fontAscii:', normalize-space(string($rPr/w:rFonts/@w:ascii)))"/>
                <xsl:sequence select="concat('fontHAnsi:', normalize-space(string($rPr/w:rFonts/@w:hAnsi)))"/>
                <xsl:sequence select="concat('fontEastAsia:', normalize-space(string($rPr/w:rFonts/@w:eastAsia)))"/>
                <xsl:sequence select="concat('fontCs:', normalize-space(string($rPr/w:rFonts/@w:cs)))"/>
            </xsl:if>
        </xsl:variable>
        <xsl:sequence select="string-join($fingerprint, '|')"/>
    </xsl:function>

    <xsl:function name="w:are-rPr-equivalent" as="xs:boolean">
        <xsl:param name="rPr1" as="element(w:rPr)?"/>
        <xsl:param name="rPr2" as="element(w:rPr)?"/>
        <xsl:sequence select="w:get-significant-rpr-fingerprint($rPr1) eq w:get-significant-rpr-fingerprint($rPr2)"/>
    </xsl:function>

    <xsl:template match="@* | node()" priority="-1">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="w:drawing | w:pict | w:hyperlink | w:smartTag | w:sdt | w:br | w:tab | w:sym | w:pgNum | w:softHyphen | w:cr | w:noBreakHyphen | w:lastRenderedPageBreak | w:instrText | w:footnoteReference | w:endnoteReference | w:annotationRef" priority="10">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
    
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

    <xsl:template match="w:proofErr | @w:*[starts-with(local-name(), 'rsid')] | w:delText | w:ins | w:moveTo | w:moveFrom" priority="15"/>
    <xsl:template match="w:rPrChange | w:pPrChange" priority="15"/>
    <xsl:template match="w:commentReference" priority="15"/>
    <xsl:template match="w:instrText[normalize-space(.) = '']" priority="15"/>
    <xsl:template match="w:r[not(normalize-space(w:t)) and not(w:*[not(self::w:rPr or self::w:t)])]" priority="15"/>

    <xsl:template name="process-paragraph-children">
        <xsl:param name="nodes" as="node()*"/>

        <xsl:for-each-group select="$nodes"
                            group-adjacent="if (self::w:r) 
                                            then w:get-significant-rpr-fingerprint(self::w:rPr)
                                            else generate-id() ">
            <xsl:variable name="current-group" select="current-group()"/>
            <xsl:variable name="first-node-in-group" select="$current-group[1]"/>

            <xsl:choose>
                <xsl:when test="$first-node-in-group[self::w:r] and 
                                w:get-significant-rpr-fingerprint($first-node-in-group/w:rPr) != ''">
                    
                    <xsl:variable name="final-merged-text-nodes" as="node()*">
                        <xsl:for-each select="$current-group[self::w:r]">
                            <xsl:sequence select="w:t/node()"/>
                        </xsl:for-each>
                    </xsl:variable>
                    <xsl:variable name="final-merged-text" select="string-join($final-merged-text-nodes, '')"/>
                    
                    <xsl:variable name="effective-rPr-of-first" select="$first-node-in-group/w:rPr[1]"/>
                    <xsl:variable name="other-children-of-first-effective-run" 
                                  select="$first-node-in-group/node()[not(self::w:rPr or self::w:t)]"/>

                    <xsl:choose>
                        <xsl:when test="count($current-group[self::w:r]) > 1 and normalize-space($final-merged-text) != ''">
                            <w:r>
                                <xsl:apply-templates select="$first-node-in-group/@*"/> <xsl:copy-of select="$effective-rPr-of-first"/>
                                <w:t xml:space="preserve"><xsl:value-of select="$final-merged-text"/></w:t>
                                <xsl:apply-templates select="$other-children-of-first-effective-run"/>
                            </w:r>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:apply-templates select="$current-group"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates select="$current-group"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each-group>
    </xsl:template>

</xsl:stylesheet>