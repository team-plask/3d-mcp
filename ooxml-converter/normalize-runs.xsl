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
    
    <xsl:variable name="fingerprint-parts" as="xs:string*">
        <xsl:if test="$rPr">
            <xsl:choose>
                <xsl:when test="$rPr/w:b[not(@w:val) or (@w:val and normalize-space(@w:val) != '0' and normalize-space(@w:val) != 'false')]"><xsl:sequence select="'b:on'"/></xsl:when>
                <xsl:otherwise><xsl:sequence select="'b:off'"/></xsl:otherwise>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="$rPr/w:bCs[not(@w:val) or (@w:val and normalize-space(@w:val) != '0' and normalize-space(@w:val) != 'false')]"><xsl:sequence select="'bCs:on'"/></xsl:when>
                <xsl:otherwise><xsl:sequence select="'bCs:off'"/></xsl:otherwise>
            </xsl:choose>

            <xsl:choose>
                <xsl:when test="$rPr/w:i[not(@w:val) or (@w:val and normalize-space(@w:val) != '0' and normalize-space(@w:val) != 'false')]"><xsl:sequence select="'i:on'"/></xsl:when>
                <xsl:otherwise><xsl:sequence select="'i:off'"/></xsl:otherwise>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="$rPr/w:iCs[not(@w:val) or (@w:val and normalize-space(@w:val) != '0' and normalize-space(@w:val) != 'false')]"><xsl:sequence select="'iCs:on'"/></xsl:when>
                <xsl:otherwise><xsl:sequence select="'iCs:off'"/></xsl:otherwise>
            </xsl:choose>

            <xsl:choose>
                <xsl:when test="$rPr/w:strike[not(@w:val) or (@w:val and normalize-space(@w:val) != '0' and normalize-space(@w:val) != 'false')]"><xsl:sequence select="'strike:on'"/></xsl:when>
                <xsl:otherwise><xsl:sequence select="'strike:off'"/></xsl:otherwise>
            </xsl:choose>
            <xsl:sequence select="concat('u:', normalize-space(if ($rPr/w:u/@w:val) then $rPr/w:u/@w:val else 'none'))"/>
            
            <xsl:if test="$rPr/w:sz/@w:val"><xsl:sequence select="concat('sz:', string($rPr/w:sz/@w:val))"/></xsl:if>
            <xsl:if test="$rPr/w:szCs/@w:val"><xsl:sequence select="concat('szCs:', string($rPr/w:szCs/@w:val))"/></xsl:if>
            
            <xsl:if test="$rPr/w:rFonts/@w:ascii"><xsl:sequence select="concat('fontAscii:', string($rPr/w:rFonts/@w:ascii))"/></xsl:if>
            <xsl:if test="$rPr/w:rFonts/@w:hAnsi"><xsl:sequence select="concat('fontHAnsi:', string($rPr/w:rFonts/@w:hAnsi))"/></xsl:if>
            <xsl:if test="$rPr/w:rFonts/@w:eastAsia"><xsl:sequence select="concat('fontEastAsia:', string($rPr/w:rFonts/@w:eastAsia))"/></xsl:if>
            <xsl:if test="$rPr/w:rFonts/@w:cs"><xsl:sequence select="concat('fontCs:', string($rPr/w:rFonts/@w:cs))"/></xsl:if>
            </xsl:if>
    </xsl:variable>
    
    <xsl:variable name="truly-significant-parts" 
                  select="$fingerprint-parts[normalize-space(.) != '' and 
                                             not(ends-with(., ':off')) and 
                                             not(ends-with(., ':none'))]"/> 
                                             
    <xsl:sequence select="if (not($rPr)) then '__NO_RPR__'
                          else if (empty($truly-significant-parts)) then '__DEFAULT_RPR__'
                          else string-join($fingerprint-parts[normalize-space(.) != ''], '|')"/>
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

    <xsl:template match="w:drawing | w:pict | w:hyperlink | w:smartTag | w:sdt |
                         w:br | w:tab | w:sym | w:pgNum | w:softHyphen | w:cr |
                         w:noBreakHyphen | w:lastRenderedPageBreak |
                         w:instrText[normalize-space(.)] | 
                         w:footnoteReference | w:endnoteReference | w:annotationRef |
                         w:object | w:bookmarkStart | w:bookmarkEnd | w:commentRangeStart | w:commentRangeEnd |
                         w:permStart | w:permEnd |
                         w:fldChar | w:footnoteRef | w:endnoteRef | w:separator | w:continuationSeparator |
                         w:r[w:drawing or w:pict or w:br or w:tab or w:sym or w:pgNum or w:softHyphen or w:cr or w:noBreakHyphen or w:lastRenderedPageBreak or w:instrText[normalize-space(.)] or w:object or w:fldChar or w:footnoteRef or w:endnoteRef or w:annotationRef or w:separator or w:continuationSeparator]"
                  priority="10">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="w:p">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:copy-of select="w:pPr"/>
            <xsl:call-template name="process-paragraph-children">
                <xsl:with-param name="nodes"
                              select="node()[not(self::w:pPr or
                                                 self::w:bookmarkStart or self::w:bookmarkEnd or
                                                 self::w:commentRangeStart or self::w:commentRangeEnd or
                                                 self::w:permStart or self::w:permEnd or
                                                 self::w:proofErr or self::w:delText or
                                                 self::w:ins or self::w:moveTo or self::w:moveFrom or
                                                 self::w:commentReference or
                                                 self::w:instrText[normalize-space(.) = ''])]"/>
            </xsl:call-template>
            <xsl:apply-templates select="w:bookmarkStart | w:bookmarkEnd | w:commentRangeStart | w:commentRangeEnd | w:permStart | w:permEnd"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="w:proofErr | @w:*[starts-with(local-name(), 'rsid')] | w:delText | w:ins | w:moveTo | w:moveFrom | w:rPrChange | w:pPrChange | w:commentReference | w:instrText[normalize-space(.) = '']" priority="20"/>

    <xsl:template match="w:r[
                        (not(w:t) or (w:t[string-length(normalize-space(.)) = 0] and not(w:t/@xml:space='preserve'))) and 
                        not(w:*[not(self::w:rPr or self::w:t or (self::w:instrText and normalize-space(.) = ''))]) and 
                        not(w:drawing or w:pict or w:br or w:tab or w:sym or w:pgNum or w:softHyphen or w:cr or w:noBreakHyphen or w:lastRenderedPageBreak or w:instrText[normalize-space(.)] or w:object or w:fldChar or w:footnoteRef or w:endnoteRef or w:annotationRef or w:separator or w:continuationSeparator) 
                       ]"
                  priority="15"/>


    <xsl:template name="process-paragraph-children">
        <xsl:param name="nodes" as="node()*"/>
        <xsl:for-each-group select="$nodes"
                            group-adjacent="if (self::w:r and
                                                not(w:drawing or w:pict or w:br or w:tab or w:sym or w:pgNum or w:softHyphen or w:cr or w:noBreakHyphen or w:lastRenderedPageBreak or w:instrText[normalize-space(.)] or w:object or w:fldChar or w:footnoteRef or w:endnoteReference or w:annotationRef or w:separator or w:continuationSeparator)
                                               )
                                            then w:get-significant-rpr-fingerprint(w:rPr)
                                            else generate-id()">
            <xsl:variable name="current-group" select="current-group()"/>
            <xsl:variable name="first-node-in-group" select="$current-group[1]"/>

            <xsl:choose>
                <xsl:when test="$first-node-in-group[self::w:r]">
                    <xsl:variable name="final-merged-text-nodes" as="node()*">
                        <xsl:for-each select="$current-group[self::w:r]">
                            <xsl:sequence select="w:t/node()"/>
                        </xsl:for-each>
                    </xsl:variable>
                    <xsl:variable name="final-merged-text" select="string-join($final-merged-text-nodes, '')"/>

                    <xsl:choose>
                        <xsl:when test="count($current-group[self::w:r]) > 1 and normalize-space($final-merged-text) != ''">
                            <w:r>
                                <xsl:apply-templates select="$first-node-in-group/@*"/>
                                <xsl:copy-of select="$first-node-in-group/w:rPr[1]"/>
                                <w:t>
                                    <xsl:if test="starts-with($final-merged-text, ' ') or
                                                  ends-with($final-merged-text, ' ') or
                                                  contains($final-merged-text, '  ') or
                                                  ($final-merged-text = '' and exists($current-group/w:r/w:t[@xml:space='preserve' and normalize-space(.) = '']))">
                                        <xsl:attribute name="xml:space">preserve</xsl:attribute>
                                    </xsl:if>
                                    <xsl:value-of select="$final-merged-text"/>
                                </w:t>
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