class CssProperties {
    static BodyTextSize = '16px'
    static LargeHeaderTextSize = '32px'
    static MediumHeadetTextSize = '24px'
    static SmallHeaderTextSize = '20px'

    static BodyTextFont = "Work Sans"
    static LargeHeaderTextFont = "Work Sans"
    static MediumHeadetTextFont = "Work Sans"
    static SmallHeaderTextFont = "Work Sans"

    static BodyTextStyle = {fontSize: this.BodyTextSize, fontFamily: this.BodyTextFont}
    static LargeHeaderTextStyle = {fontSize: this.LargeHeaderTextSize, fontFamily: this.LargeHeaderTextFont}
    static MediumHeadetTextStyle = {fontSize: this.MediumHeadetTextSize, fontFamily: this.MediumHeadetTextFont}
    static SmallHeaderTextStyle = {fontSize: this.SmallHeaderTextSize, fontFamily: this.SmallHeaderTextFont}
}

export default CssProperties