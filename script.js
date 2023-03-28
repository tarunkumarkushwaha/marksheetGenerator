(() => {
    "use strict";
    class e {
        static ready(e) {
            (document.attachEvent ? "complete" === document.readyState : "loading" !== document.readyState) ? e() : document.addEventListener("DOMContentLoaded", e);
        }
        static consoleLog(e) {
            console.log(`%c ${e}`, "background: #222; color: #bada55");
        }
        static delay = (e) => new Promise((t) => setTimeout(t, e));
        static setMyCookie(e, t = !0, o = 365) {
            const i = new Date();
            i.setTime(i.getTime() + 24 * o * 60 * 60 * 1e3);
            let n = "expires=" + i.toUTCString();
            document.cookie = e + "=" + t + ";" + n + ";path=/";
        }
        static removeMyCookie(e) {
            document.cookie = `${e}=; expires=Thu, 01 Jan 1980 00:00:00 UTC; path=/;`;
        }
        static getMyCookie(e) {
            let t = e + "=",
                o = decodeURIComponent(document.cookie).split(";");
            for (let e = 0; e < o.length; e++) {
                let i = o[e];
                for (; " " == i.charAt(0); ) i = i.substring(1);
                if (0 == i.indexOf(t)) return i.substring(t.length, i.length);
            }
            return "";
        }
        static httpGet(e) {
            var t = new XMLHttpRequest();
            return t.open("GET", e, !1), t.send(null), t.responseText;
        }
        static consentId() {
            return (Date.now() + parseInt(Math.random().toString().substr(2))).toString().substring(5, 17);
        }
        static setSelectionCookie(t = null) {
            var o = [],
                i = document.getElementsByTagName("input");
            if (null == t) for (var n = i.length - 1; n >= 0; n--) "checkbox" === i[n].type && i[n].checked && o.push(i[n].value);
            else o.push(t);
            e.setMyCookie("zcconsentTarget", o);
        }
        static allowedCookieCategory() {
            var t = e.getMyCookie("zcconsentTarget"),
                o = e.getMyCookie("zcconsent");
            return "accepted" != o && ("" != t && "acceptedCustomized" == o ? t.split(",") : "rejected" == o ? ["Strictly Necessary"] : void 0);
        }
    }
    class t {
        constructor(t) {
            (this.config = t), e.consoleLog("Script Handler Initiated");
        }
        init() {
            this.blockScripts(), this.unblockScripts();
        }
        async blockScripts() {
            e.ready(async () => {
                var t = e.allowedCookieCategory();
                if (0 != t)
                    for (var o = document.querySelectorAll("script[cz-script-category]"), i = 0; i < o.length; i++) {
                        var n = o[i];
                        if (t.indexOf(n.getAttribute("cz-script-category")) < 0) {
                            var s = document.createElement("script"),
                                c = n.parentNode;
                            for (var a of ((n.type = "text/plain"), await e.delay(500), n.attributes)) s.setAttribute(a.nodeName, a.nodeValue);
                            s.setAttribute("data-cookieconsent", !0), (s.innerHTML = n.innerHTML), c.insertBefore(s, n), c.removeChild(n);
                        }
                    }
            });
        }
        async unblockScripts() {
            e.ready(async () => {
                for (var t = document.querySelectorAll("script[cz-script-category]"), o = e.allowedCookieCategory(), i = 0; i < t.length; i++) {
                    var n = t[i];
                    if (!o || -1 != o.indexOf(n.getAttribute("cz-script-category"))) {
                        var s = document.createElement("script"),
                            c = n.parentNode;
                        for (var a of ((n.type = "text/javascript"), await e.delay(500), n.attributes)) s.setAttribute(a.nodeName, a.nodeValue);
                        s.setAttribute("data-cookieconsent", !0), (s.innerHTML = n.innerHTML), c.insertBefore(s, n), c.removeChild(n);
                    }
                }
            });
        }
    }
    class o {
        constructor(t) {
            (this.config = JSON.parse(t)), e.consoleLog("Cookie Handler Initiated");
        }
        init() {
            this.deleteSelection();
        }
        deleteSelection() {
            var t = document.cookie.split(";"),
                o = this.collectAllowedCookieNames();
            if (o) {
                e.consoleLog("Removing selected cookies "), e.consoleLog("Cookies will be remove is " + JSON.stringify(o));
                for (var i = 0; i < t.length; i++) {
                    var n = t[i],
                        s = n.indexOf("="),
                        c = s > -1 ? n.substr(0, s) : n;
                    o.indexOf(c) > -1 && ((document.cookie = c + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"), e.consoleLog(c + "Cookie is deleted beca of rejection"));
                }
            } else e.consoleLog("Accepted all cookies,nothing to delete.");
        }
        collectAllowedCookieNames() {
            var t = e.getMyCookie("zcconsentTarget"),
                o = e.getMyCookie("zcconsent"),
                i = e.getMyCookie("zcccpaCookies");
            if ("accepted" == o) return !1;
            if ("" != t && "acceptedCustomized" == o) var n = t.split(",");
            else "rejected" == o ? (n = ["Strictly Necessary"]) : "" != i && (n = i.split(","));
            "" != o && e.consoleLog("Cookies Consent selected is +" + o), "" != i && e.consoleLog("CCPA not to sell is enabled +" + n), e.consoleLog("Categories will not delete is +" + n);
            var s = this.config.cookies,
                c = [];
            for (const [e, t] of Object.entries(s)) if (n.indexOf(t.categoryName) < 0) for (var a = 0; a < t.categoryCookies.length; a++) c.push(t.categoryCookies[a].Cookie);
            return c;
        }
    }
    class i {
        constructor(t) {
            (this.config = t), (this.settings = this.config.banner_settings), e.consoleLog("Data post get initiated"), (this.userInfo = {});
        }
        init() {
            (this.userInfo.ip = sessionStorage.getItem("uccIpdetails")), (this.userInfo.uuid = this.settings.uuid), (this.userInfo.website_id = this.settings.website_id), (this.userInfo.ip = sessionStorage.getItem("uccIpdetails"));
        }
        send(t) {
            (this.userInfo.date = new Date().toLocaleString()), (this.userInfo.consentId = e.consentId()), (this.userInfo.consent_status = t), e.consoleLog(JSON.stringify({ data: this.userInfo }));
            var o = new XMLHttpRequest(),
                i = this.config.script.split("embed/");
            o.open("POST", i[0] + "api/save_consent", !0), o.setRequestHeader("Content-Type", "application/json"), o.send(JSON.stringify({ data: this.userInfo }));
        }
    }
    class n {
        constructor(t) {
            (this.config = JSON.parse(t)),
                e.consoleLog("Dom Include Initiated"),
                this.dataPost,
                (this.settings = this.config.banner_settings),
                (this.cookiesModal = ".cookies-modal"),
                (this.customizeModal = ".customize_container"),
                (this.cookieTooltip = ".cookie-tooltip"),
                (this.cookiesOverlay = ".cookies-overlay"),
                (this.closeButton = document.querySelector(".modal-close")),
                (this.acceptCookies = ".accept"),
                (this.rejectCookies = ".reject"),
                (this.customizeCookies = ".cookies-body-btns-customize-button"),
                (this.cookieFloatingIconDiv = ".floating-icon-main-div"),
                (this.title = ".customize_content-title"),
                (this.all = ".customize_options-all"),
                (this.mainSection = ".customize_options"),
                (this.accept = ".acceptAll"),
                (this.reject = ".rejectAll"),
                (this.ccpaModal = ".ccpa-popup-modal"),
                (this.ccpaOverlay = ".ccpa-overlay"),
                (this.ccpaWidget = ".ccpa-banner"),
                (this.ccpaShowPopupTrigger = ".ccpa-preference-modal-show-btn"),
                (this.saveCCPACustomize = ".ccpa-modal-save-btn"),
                (this.cancelCCPACustomize = ".ccpa-modal-cancel-btn"),
                (this.saveCustomize = ".save"),
                (this.cancelCustomize = ".cancel"),
                (this.inputs = ".customize_options-item-selector input"),
                (this.description = document.querySelectorAll(".customize_options-item-desc"));
        }
        init(e) {
            "GDPR" == this.settings.consent_template ? (this.main(), window.addEventListener("resize", this.resizeEvent)) : this.ccpaBanner(), (this.dataPost = new i(this.config)), this.dataPost.init();
            var t = this;
            document.addEventListener("keyup", function (e) {
                ((void 0 !== typeof e.keyCode && "27" == e.keyCode) || (void 0 !== typeof e.key && "27" == e.key)) && ("GDPR" == t.settings.consent_template ? t.cookiesHide() : t.ccpaHide());
            });
        }
        dom(e, t = !1) {
            return t ? document.querySelectorAll(e) : document.querySelector(e);
        }
        sendData(t, o = "GDPR") {
            if (void 0 !== this.settings.consent_log || this.settings.consent_log)
                if ("GDPR" == o) this.dataPost.send(t);
                else {
                    var i = "true" == e.getMyCookie("zcccpaSell") ? "don't sell" : "sell";
                    this.dataPost.send(i);
                }
            else e.consoleLog("Consent log not eanbled");
        }
        generateHtml = (e) => {
            const t = document.createElement("template");
            return (t.innerHTML = e.trim()), t.content.firstElementChild;
        };
        ccpaBanner = () => {
            const e = this.generateHtml(
                `  <div>\n\n        <div class="ccpa-overlay" style="\n    position: fixed;\n    top: 0;\n    left: 0;\n    background-color: black;\n    opacity: .5;\n    height: 100%;\n    width: 100vw;\n    z-index: 9999;\n    display:none;\n    "></div><div class="ccpa-banner" style="display: block; position: fixed; width: 100%; bottom: 0px; background:${this.settings["banner-bg"]}; padding: 20px 20px 5px; box-shadow: rgba(172, 171, 171, 0.3) 0px -1px 10px 0px; border: 1px solid rgb(212, 216, 223); z-index: 999999999;display:none;">\n            <h3 style="text-align:start;font-size:18px;color:${this.settings["banner-title"]};">We value your privacy</h3>\n            <div style="display:flex;text-align:start;margin-top:10px;">\n                <p style="font-size:13px;color:${this.settings["banner-message"]};">This website or its third-party tools process personal data.\n                    You can opt out of the sale of your personal information by clicking on the â€œDo Not\n                    Sell My Personal Informationâ€ link.</p>\n                <p class="ccpa-preference-modal-show-btn" style="cursor:pointer;font-size:13px;color:rgb(24,99,220);margin-left:15px;">Do Not\n                    Sell My Personal\n                    Information</p>\n            </div>\n            <button style="    position: absolute;\n            top: 6px;\n            right: 6px;\n            border: none;\n            color: gray;\n            background:none;cursor:pointer;" onclick="domInclude.ccpaHide()"><i class="fa-solid fa-xmark"></i></button>\n            </div></div>`
            );
            null == document.querySelector(".ccpa-banner") && document.body.appendChild(e);
            const t = this.generateHtml(
                '<div class="ccpa-popup-modal" style="position: fixed; z-index: 2147483647;display:none; top: 50%;left: 50%;transform: translate(-50%, -50%);">\n        <div class="cky-preference-center" data-cky-tag="optout-popup" style="color: #212121; border-color: #2A2A2A; background-color: #FFFFFF;    max-height: 79vh;\n                overflow: hidden;\n                max-width: 845px;\n                overflow: hidden;\n                flex: 1 1 0;\n                display: flex;\n                flex-direction: column;\n                border-radius: 6px;">\n            <div class="cky-preference-header" style="display: flex;\n            align-items: center;\n            justify-content: space-between;\n            padding: 22px 24px;\n            border-bottom: 1px solid;"> <span class="cky-preference-title" data-cky-tag="optout-title" style="color: #212121;font-size:18px;font-weight:bold">Opt-out\n                    Preferences</span>\n                \x3c!-- <button class="cky-btn-close" aria-label="Close" data-cky-tag="optout-close"> <img\n                        src="/assets/images/close.svg" alt="Close"> </button> --\x3e\n            </div>\n            <div class="cky-preference-body-wrapper" style="    padding: 0 24px;\n            flex: 1;\n            overflow: auto;\n            box-sizing: border-box;">\n                <div class="cky-preference-content-wrapper" data-cky-tag="optout-description" style="color: #212121;padding:12px 0;border-bottom: 1px solid;">\n                    <p style="text-align:start;font-size:14px;margin:0px;">We use third-party\n                        cookies that help us analyze how\n                        you use this website,\n                        store your preferences, and provide the content and advertisements that are\n                        relevant to you. However, you can opt out of these cookies by checking "Do\n                        Not Sell My Personal Information" and clicking the "Save My Preferences"\n                        button. Once you opt out, you can opt in again at any time by unchecking "Do\n                        Not Sell My Personal Information" and clicking the "Save My Preferences"\n                        button.</p>\n                </div>\n                <div class="cky-opt-out-wrapper" style="padding:12px;">\n                    <div class="cky-opt-out-checkbox-wrapper" data-cky-tag="optout-option" style="    display: flex;\n                    align-items: center;"> <input style="background-color: #ffffff;\nborder: 1px solid #000000;\nwidth: 20px;\nheight: 18.5px;\nmargin: 0;\nposition: relative;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\nborder-radius: 2px;\ncursor: pointer;" id="ckyCCPAOptOut" type="checkbox" class="cky-opt-out-checkbox" data-cky-tag="optout-option-toggle" aria-label="Enable Do Not Sell My Personal Information">\n                        <div class="cky-opt-out-checkbox-label" data-cky-tag="optout-option-title" style="color: #212121;    font-size: 16px;\n                            font-weight: 700;\n                            line-height: 24px;\n                            margin: 0 0 0 12px;\n                            cursor: pointer;"> Do Not Sell My Personal Information </div>\n                    </div>\n                </div>\n            </div>\n            <div class="cky-footer-wrapper">\n                <div class="cky-opt-out-btn-wrapper" data-cky-tag="optout-buttons" style="display: flex;\n                flex-wrap: wrap;\n                align-items: center;\n                justify-content: center;\n                padding: 22px 24px;"> <button class="ccpa-modal-cancel-btn" aria-label="Cancel" data-cky-tag="optout-cancel-button" style="color: #858585; border-color: #DEDFE0; background-color: #FFFFFF;    font-size: 14px;\n                        font-family: inherit;\n                        line-height: 24px;\n                        padding: 8px 27px;\n                        font-weight: 500;\n                        margin: 0 8px 0 0;\n                        border-radius: 2px;\n                        white-space: nowrap;\n                        cursor: pointer;\n                        text-align: center;\n                        text-transform: none;\n                        min-height: 0;\n                        flex: auto;\nmax-width: 100%;\ntext-shadow: none;\nbox-shadow: none;\nborder: 1px solid #dedfe0;\nbackground: transparent;">\n                        Cancel </button> <button class="ccpa-modal-save-btn" aria-label="Save My Preferences" data-cky-tag="optout-confirm-button" style="color: #F4F4F4; border-color: #1863DC; background-color: #1863DC;    background: #1863dc;\n                        color: #ffffff;\n                        border: 1px solid #1863dc;\n                        flex: auto;\nmax-width: 100%;\ntext-shadow: none;\nbox-shadow: none;\n\nfont-size: 14px;\nfont-family: inherit;\nline-height: 24px;\npadding: 8px 27px;\nfont-weight: 500;\nmargin: 0 8px 0 0;\nborder-radius: 2px;\nwhite-space: nowrap;\ncursor: pointer;\ntext-align: center;\ntext-transform: none;\nmin-height: 0;">\n                        Save My Preferences </button> </div>\n\n            </div>\n            <div style="padding: 8px 24px; font-size: 12px; font-weight: 400; line-height: 20px; text-align: right; display: flex; justify-content: flex-end; align-items: center; color: #293C5B; background-color: #EDEDED;"> Powered by <a style="text-decoration:none;" target="_blank" rel="noopener" href="https://www.cookieyes.com/product/cookie-consent"><span style="margin-left:6px;">Cookizen</span></a> </div>\n        </div>\n\n\n    </div>'
            );
            null == document.querySelector(".ccpa-popup-modal") && document.body.appendChild(t), this.ccpa(), this.dom(this.ccpaShowPopupTrigger).setAttribute("onclick", "domInclude.ccpaCustomize()");
        };
        main = () => {
            var t = this;
            const o = t.generateHtml(
                    `\n          <div>\n          <div class="cookies-overlay" style="\n      position: fixed;\n      top: 0;\n      left: 0;\n      background-color: black;\n      opacity: .5;\n      height: 100%;\n      width: 100vw;\n      z-index: 9999;\n      display:none;\n      "></div>\n      <div class="cookies-modal ccmodal-${this.settings.layout}" style="\n      border: 1px solid;\n      display:none;\n      position: fixed;\n      width: 800px;\n      max-width: 80%;\n      background:${this.settings["banner-bg"]};\n      border-color:${this.settings["banner-border"]};\n      text-align:left;\n      z-index: 999999999;\n      border-radius: 8px;">\n          <div class="cookies-head" style="\n          background-color:${this.settings["banner-title-bg"]};\n          \n          color:${this.settings["banner-title"]};\n          font-size: 20px;\n          font-weight: 400;\n          padding: 15px 20px;\n          border-top-left-radius: 8px;\n          border-top-right-radius: 8px;display:flex;\n          justify-content: space-between;">\n              ${this.settings.title}\n              <button style="    position: absolute;\n                  top: 6px;\n                  right: 6px;\n                  border: none;\n                  color: black;\n                  background: none;\n                  cursor: pointer;\n                  height: 30px;\n                  width: 30px;\n                  vertical-align: middle;\n                  position: relative;\n                  display: flex;\n                  justify-content: center;\n                 \n                  cursor:pointer;" onclick="domInclude.cookiesHide();domInclude.showFloatingIcon();"><i class="fa-solid fa-xmark"></i></button>\n          </div>\n          <div class="cookies-body" style="\n          padding: 24px;\n          padding-top:10px;\n          color:black;\n          font-size: 16px;\n          display: flex;\n          flex-direction: column;\n          justify-content: space-between;\n          height: 100%;">\n              <div class="cookies-body-desc"\n                  style="color:${this.settings["banner-message"]};font-size:12px;line-height:20px;margin-top:10px;">${this.settings.message}</div>\n              <div class="cookies-body-btns" style="\n              display: flex;\n              justify-content: space-between;\n              margin-top: 32px;margin-bottom:6px;">\n                  <div class="cookies-body-btns-customize">\n                      <button class="cookies-body-btns-customize-button" style="\n                      border: 1px solid ${this.settings["preference-btn-border"]};\n                      padding: 10px 35px;\n                      border-radius:4px;\n                      \n                      background-color:${this.settings["preference-btn-bg"]};\n                          color:${this.settings["preference-btn-text"]};\n                          font-size:12px;\n                        \n                      cursor: pointer;">Preferences</button>\n                  </div>\n                  <div class="cookies-body-btns-choice">\n                      <button class="cookies-body-btns-choice-button reject" style="\n                      border: 2px solid  ${this.settings["reject-btn-border"]};\n                      background-color: ${this.settings["reject-btn-bg"]};\n                      color:${this.settings["reject-btn-text"]};\n                      margin:0 5px;\n                      padding: 10px 20px;\n                      font-weight: 500;\n                      letter-spacing: 2px;\n                      border-radius:4px;font-size:12px;\n                      cursor: pointer;">Reject</button>\n                      <button class="cookies-body-btns-choice-button accept" style="\n                       border: 2px solid ${this.settings["accept-btn-border"]};\n                      background-color: ${this.settings["accept-btn-bg"]};\n                      color: ${this.settings["accept-btn-text"]};\n                      margin:0 5px;\n                      padding: 10px 20px;\n                      font-weight: 500;\n                      letter-spacing: 2px;\n                      border-radius:4px;font-size:12px;\n                      cursor: pointer;">Accept</button>\n                  </div>\n              </div>\n          </div>\n      </div>\n      <div class="customize_container" style="\n      height: 95%;\n      z-index: 99999999999999999;\n      position: fixed;\n      top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n      display:none;\n      background-color: white;\n      display: flex;\n      flex-direction: column;\n      width: 700px;\n      max-width: 80%;\n      display:none;\n      border-radius: 18px;">\n          <div class="customize_content">\n              <h1 class="customize_content-title" style="\n                  border-top-left-radius:  18px;\n                  border-top-right-radius: 18px ;\n                  background-color: rgb(255 255 255);\n                  color: black;\n                  margin: 0;\n                  font-size: 18px;\n                  padding: 30px 30px;\n                  border-bottom: 0.1px solid white;">${this.settings.customize_title}</h1>\n          </div>\n          <div class="customize_options" style="overflow-y: scroll; height:100%;">\n              <h4 class="customize_content-subtitle" style="\n                  font-weight: 400;\n                  background-color: rgb(255 255 255);\n                  color: black;\n                  padding: 10px 30px;\n                  margin: 0;\n                  font-size: 12px;">${this.settings.customize_message}\n              </h4>\n              <div class="customize_options-all" style="\n                  padding: 15px 30px;\n                  display: flex;\n                  justify-content: flex-end;\n                  background:rgb(255 255 255);\n                  border-bottom: 0.5px solid rgba(0, 0, 0, 0.1)">\n                  <button style="\n                          background:transparent;\n                          margin: 0 8px;\n                          padding: 8px 10px;\n                          color:rgb(24,99,220);\n                          border-radius: 4px;\n                          font-size: 14px;\n                          cursor: pointer;\n                          border: 2px solid rgb(24,99,220);\n                          display: flex;\n                          justify-content: space-evenly;\n                          align-items: center;\n                          white-space: nowrap;\n                      " class="customize_options-all-btn rejectAll"><i style="margin: 0 5px;"\n                          class="fa fa-x "></i> Reject\n                      all</button>\n                  <button style="\n                            background: transparent;\n                          margin: 0 8px;\n                          padding: 8px 10px;\n                          color:rgb(24,99,220);\n                          border-radius: 4px;\n                          font-size: 14px;\n                          cursor: pointer;\n                          border: 2px solid rgb(24,99,220);\n                          display: flex;\n                          justify-content: space-evenly;\n                          align-items: center;\n                          white-space: nowrap;\n                      " class="customize_options-all-btn acceptAll"><i style="margin: 0 5px;"\n                          class="fa fa-check"></i> Accept\n                      all</button>\n              </div>\n              <div class="preference-title-container"\n                  style="padding:30px;background:rgb(255 255 255);color:black;">\n                  <div class="customize_options-item-title-privacy" style="width: 60%;font-weight:bold;\n                      font-size: 14px;text-align:left;\n                     \n                      font-weight: bold;">we value our privacy</div>\n                  <div style="margin : 12px 0px;font-size:13px;text-align:justify;padding:6px;"> We\n                      use cookies to enhance your browsing experience, serve personalized ads or\n                      content, and analyze our traffic. By clicking "Accept All", you consent to our\n                      use of cookies. </div>\n                  <div class="customize_options-item-title-privacy" style="width: 60%;font-weight:bold;\n                      font-size: 14px;text-align:left;\n                     \n                      font-weight: bold;">Customize Consent Preferences</div>\n                  <div style="margin : 12px 0px;font-size:12px;padding:6px;text-align:justify;"> We\n                      use cookies to help you navigate efficiently and perform certain functions. You\n                      will find detailed information about all cookies under each consent category\n                      below. The cookies that are categorized as "Necessary" are stored on your\n                      browser as they are essential for enabling the basic functionalities of the\n                      site. We also use third-party cookies that help us analyze how you use this\n                      website, store your preferences, and provide the content and advertisements that\n                      are relevant to you. These cookies will only be stored in your browser with your\n                      prior consent. You can choose to enable or disable some or all of these cookies\n                      but disabling some of them may affect your browsing experience.</div>\n              </div>\n              <div class="customize_options-list" style="\n                  padding: 10px;background:rgb(255 255 255);color:black;\n                  ">\n      \n              </div>\n          </div>\n          <div class="customize_footer" style="\n              display: flex;\n              background:rgb(255 255 255);\n              justify-content: space-between;\n              padding: 10px 30px;\n              box-shadow: 0px -5px 12px rgba(0, 0, 0, 0.2);\n              ">\n              <button style="\n                 \n              \n                      cursor: pointer;\n                      padding: 6px 12px;\n                      color:rgb(24,99,220);\n                      border:1px solid rgb(24,99,220);\n                      border-radius: 4px;\n                      background: transparent;\n                  " class="customize_footer-item cancel"\n                  style="background: rgba(0, 0, 0, 0.5)">Cancel</button>\n              <button style="\n                      border-radius: 4px;\n                      padding: 6px 12px;\n                      border: 1px solid ${this.settings["customize-btn-border"]};\n                      cursor: pointer;\n                      color:${this.settings["customize-btn-text"]};\n                      background:${this.settings["customize-btn-bg"]};" class="customize_footer-item save">Save all and\n                  continue</button>\n          </div>\n      </div>\n          </div>\n            `
                ),
                i = document.querySelector(".customizeBanner__output--banner");
            i ? i.appendChild(o) : document.body.appendChild(o),
                "" == e.getMyCookie("zcconsent") ? t.showFloatingIcon("none") : t.showFloatingIcon(),
                this.dom(this.cookieFloatingIconDiv).setAttribute("onclick", "domInclude.handlefloatingIcon()"),
                this.dom(this.cookieFloatingIconDiv).setAttribute("onmouseover", "domInclude.handleHover()"),
                this.dom(this.cookieFloatingIconDiv).setAttribute("onmouseout", "domInclude.handleMouseOut()"),
                t.fetchCookie(this.config.cookies),
                t.cookies(),
                t.handleDropDown();
        };
        handleHover = () => {
            this.dom(this.cookieTooltip).style.display = "block";
        };
        handleMouseOut = () => {
            this.dom(this.cookieTooltip).style.display = "none";
        };
        handlefloatingIcon = () => {
            this.cookiesShow(10), this.showFloatingIcon("none");
        };
        scrollSection = () => {
            this.dom(this.mainSection).addEventListener("scroll", () => {
                this.dom(this.title).getBoundingClientRect().bottom >= this.dom(this.all).getBoundingClientRect().top
                    ? ((this.dom(this.all).style.position = "sticky"), (this.dom(this.all).style.top = "0"), (this.dom(this.all).style.zIndex = "1000"), (this.dom(this.all).style.boxShadow = "10px 0 10px grey"))
                    : ((this.dom(this.all).style.position = "relative"), (this.dom(this.all).style.boxShadow = "none"));
            });
        };
        ccpa = () => {
            this.showCcpaBanner() && this.ccpaShow();
        };
        cookies = () => {
            this.showCookieBanner() && this.cookiesShow(),
                this.dom(this.acceptCookies).setAttribute("onclick", "domInclude.accepted()"),
                this.dom(this.rejectCookies).setAttribute("onclick", "domInclude.rejected()"),
                this.dom(this.customizeCookies).setAttribute("onclick", "domInclude.customize()");
        };
        showCcpaBanner = () => "" == e.getMyCookie("zcccpa");
        showCookieBanner = () => "" == e.getMyCookie("zcconsent");
        ccpaCustomize = () => {
            this.dom(this.ccpaWidget).classList.add("ccremove"),
                this.dom(this.ccpaWidget).classList.remove("ccshow"),
                this.dom(this.ccpaWidget).classList.remove("cookies-modal-popup"),
                this.dom(this.ccpaModal).classList.remove("ccremove"),
                this.dom(this.ccpaModal).classList.add("ccshow"),
                this.overlayShow(),
                this.dom(this.saveCCPACustomize).setAttribute("onclick", "domInclude.saveCCPA()"),
                this.dom(this.cancelCCPACustomize).setAttribute("onclick", "domInclude.cancelCCPA()");
        };
        saveCCPA = () => {
            this.ccpaHide(),
                this.closeCcpaCustomize(),
                e.setMyCookie("zcccpa", "accepted"),
                e.setMyCookie("zcccpaSell", document.getElementById("ckyCCPAOptOut").checked),
                document.getElementById("ckyCCPAOptOut").checked && (e.setMyCookie("zcccpaCookies", this.settings.ccpa_cookies_preset), cookieHandler.deleteSelection()),
                this.sendData("all", "ccpa"),
                this.overlayHide(),
                scriptHandler.init();
        };
        cancelCCPA = () => {
            this.dom(this.ccpaWidget).classList.add("ccshow"),
                this.dom(this.ccpaWidget).classList.remove("ccremove"),
                this.dom(this.ccpaWidget).classList.add("cookies-modal-popup"),
                this.dom(this.ccpaModal).classList.remove("ccshow"),
                this.dom(this.ccpaModal).classList.add("ccremove");
        };
        customize = () => {
            this.cookiesHide(),
                this.overlayShow(),
                this.dom(this.cookiesModal).classList.remove("cookies-modal-popup"),
                this.dom(this.cookiesModal).classList.add("cchide"),
                this.dom(this.cookiesModal).classList.remove("ccshow"),
                this.dom(this.customizeModal).classList.add("ccshow"),
                this.dom(this.customizeModal).classList.remove("cchide"),
                this.dom(this.accept).setAttribute("onclick", "domInclude.accepted()"),
                this.dom(this.reject).setAttribute("onclick", "domInclude.rejected()"),
                this.dom(this.saveCustomize).setAttribute("onclick", "domInclude.saveCookies()"),
                this.dom(this.cancelCustomize).setAttribute("onclick", "domInclude.cancelCookies()"),
                this.selectCategoryCheckbox(),
                this.scrollSection();
        };
        selectCategoryCheckbox = () => {
            var e = this;
            this.dom(this.inputs, !0).forEach((t) => {
                t.checked = "" != e.isCookieSelected(t.value);
            });
        };
        closeCustomize = () => {
            this.dom(this.customizeModal).classList.add("cchide"), this.dom(this.customizeModal).classList.remove("ccshow");
        };
        closeCcpaCustomize = () => {
            this.dom(this.ccpaModal).classList.add("cchide"), this.dom(this.ccpaModal).classList.remove("ccshow"), this.overlayHide();
        };
        overlayShow = () => {
            null != this.dom(this.cookiesOverlay)
                ? (this.dom(this.cookiesOverlay).classList.add("ccshowOverlay"), this.dom(this.cookiesOverlay).classList.remove("cchideOverlay"), this.dom(this.cookiesOverlay).classList.add("overlay-on"))
                : (this.dom(this.ccpaOverlay).classList.add("ccshowOverlay"), this.dom(this.ccpaOverlay).classList.remove("cchideOverlay"), this.dom(this.ccpaOverlay).classList.add("overlay-on")),
                this.updatePageHtmlStyle();
        };
        overlayHide = () => {
            null != this.dom(this.cookiesOverlay)
                ? (this.dom(this.cookiesOverlay).classList.remove("ccshowOverlay"), this.dom(this.cookiesOverlay).classList.add("cchideOverlay"), this.dom(this.cookiesOverlay).classList.add("overlay-on"))
                : (this.dom(this.ccpaOverlay).classList.remove("ccshowOverlay"), this.dom(this.ccpaOverlay).classList.add("cchideOverlay"), this.dom(this.ccpaOverlay).classList.remove("overlay-on")),
                this.revertPageHtmlStyle();
        };
        cookiesShow = (e = 1e3) => {
            var t = this;
            setTimeout(() => {
                t.dom(t.cookiesModal).classList.add("ccshow"), t.dom(t.cookiesModal).classList.remove("cchide"), t.overlayShow();
            }, e);
        };
        ccpaShow = (e = 1e3) => {
            var t = this;
            setTimeout(() => {
                t.dom(t.ccpaWidget).classList.add("ccshow"), t.dom(t.ccpaWidget).classList.remove("cchide"), t.overlayShow();
            }, e);
        };
        cookiesHide = () => {
            this.dom(this.cookiesModal).classList.remove("ccshow"), this.overlayHide(), this.dom(this.cookiesModal).classList.add("cchide"), this.dom(this.cookiesOverlay).classList.remove("overlay-on"), this.revertPageHtmlStyle();
        };
        revertPageHtmlStyle() {
            document.querySelector("html").style.overflowY = "initial";
        }
        updatePageHtmlStyle() {
            document.querySelector("html").style.overflowY = "hidden";
        }
        ccpaHide = () => {
            this.dom(this.ccpaWidget).classList.remove("ccshow"), this.dom(this.ccpaWidget).classList.add("cchide"), this.overlayHide(), this.revertPageHtmlStyle();
        };
        accepted = () => {
            this.cookiesHide(), this.closeCustomize(), this.showFloatingIcon(), e.setMyCookie("zcconsent", "accepted"), this.sendData("all"), scriptHandler.init();
        };
        rejected = () => {
            this.cookiesHide(),
                this.showFloatingIcon(),
                this.closeCustomize(),
                e.setMyCookie("zcconsent", "rejected"),
                e.setSelectionCookie("Strictly Necessary"),
                this.sendData("none"),
                cookieHandler.deleteSelection(),
                scriptHandler.init();
        };
        saveCookies = () => {
            this.cookiesHide(), this.showFloatingIcon(), this.closeCustomize(), e.setMyCookie("zcconsent", "acceptedCustomized"), e.setSelectionCookie(), this.sendData("selection"), cookieHandler.deleteSelection(), scriptHandler.init();
        };
        cancelCookies = () => {
            this.dom(this.customizeModal).classList.add("cchide"), this.dom(this.cookiesModal).classList.add("cookies-modal-popup"), (document.querySelector("html").style.overflowY = "initial"), this.cookiesShow(10);
        };
        resizeEvent = () => {
            document.body.getBoundingClientRect().width < 484
                ? ((document.querySelector(".cookies-body-btns").style.flexDirection = "column"),
                  (this.dom(this.customizeCookies).style.width = "100%"),
                  (this.dom(this.acceptCookies).style.width = "50%"),
                  (this.dom(this.rejectCookies).style.width = "50%"),
                  (document.querySelector(".cookies-body-btns-choice").style.display = "flex"),
                  (document.querySelector(".cookies-body-btns-choice").style.margin = "10px 0"))
                : document.body.getBoundingClientRect().width > 484 &&
                  ((document.querySelector(".cookies-body-btns").style.flexDirection = "row"),
                  (this.dom(this.customizeCookies).style.width = "inherit"),
                  (this.dom(this.acceptCookies).style.width = "inherit"),
                  (this.dom(this.rejectCookies).style.width = "inherit"),
                  (document.querySelector(".cookies-body-btns-choice").style.display = "inherit"),
                  (document.querySelector(".cookies-body-btns-choice").style.margin = "0"));
        };
        handleDropDown = () => {
            const e = document.querySelectorAll(".customize_options-item-title"),
                t = document.querySelectorAll(".desc-title"),
                o = document.querySelectorAll(".fa-chevron-down"),
                i = document.querySelectorAll(".cookie-data-container");
            for (let n = 0; n < e.length; n++)
                e[n].addEventListener("click", () => {
                    "Show" == t[n].innerHTML
                        ? ((t[n].innerHTML = "Hide"), (o[n].style.transform = "rotate(0deg)"), (i[n].style.display = "block"))
                        : "Show" != t[n].innerHTML && ((o[n].style.transform = "rotate(-90deg)"), (t[n].innerHTML = "Show"), (i[n].style.display = "none"));
                });
        };
        generateCookiesHtml = (e) => {
            let t = "";
            return (
                e.categoryCookies.forEach((e) => {
                    t += ` <div class="single-cookie-data" style="    border-bottom: 1px solid white;\n            padding-bottom: 12px;">\n            <div style="display:flex;margin:10px 0px;">\n                <div style="width:90px;font-size:13px;">Cookie</div>\n                <div>${e.Cookie}</div>\n            </div>\n            <div style="display:flex; margin:10px 0px;">\n            <div style="width:90px;font-size:13px;">Duration</div>\n            <div>${e.Duration}</div>\n            </div>\n            <div style="display:flex; margin:10px 0px;">\n            <div style="margin-right:13px;font-size:13px;">Description</div>\n            <div>${e.Description}</div>\n            </div>\n             </div>        \n            `;
                }),
                t
            );
        };
        fetchCookie = (e) => {
            var t = this;
            const o = document.querySelector(".customize_options-list");
            let i = "";
            e.forEach((e) => {
                i += `<div class="customize_options-item" style="\n        padding: 25px 0;\n        height: 40%;\n        border-bottom: 1px solid  #ffffff47;\n        width:94%;\n        ">\n            <div class="customize_options-item-main" style="\n            display: flex;\n            justify-content: space-between;\n            font-size: 14px;\n            align-items: center;\n            ">\n      \n                <div class="customize_options-item-title" style="display:flex;align-items:center; width: 60%;padding:0px 14px;">\n                <div class="customize_options-item-descBtn" style="\n                width: fit-content;\n                cursor: pointer;\n                user-select: none;\n                font-size: 10px;\n                margin-right:8px;\n                "><span class="desc-title"style="display:none" >Show</span>\n                    <i style="\n                    transition: .3s;\n                    transform: rotate(-90deg);\n                    margin: 0 5px;font-size:12px;\n                    " class="fa fa-chevron-down"></i>\n                </div>\n                <div style="font-size:16px;">\n      \n                ${
                    e.categoryName
                }</div>\n              </div>\n      \n              ${
                    "Strictly Necessary" === e.categoryName
                        ? `<span style="    color:#08d1ff;\n              font-weight: 600;\n              line-height: 24px;\n              font-size: 14px;">Always Active</span><input style="display:none;" class="uccSelection" checked type="checkbox" value="${e.categoryName}">`
                        : `<div class="customize_options-item-selector" style="width: 5%;">\n              <label class="switch">\n              <input type="checkbox" ${t.isCookieSelected(e.categoryName)} class="uccSelection" value="${
                              e.categoryName
                          }">\n              <span class="slider round"></span>\n            </label>\n              </div>`
                }\n             \n            </div>\n            <div class="customize_options-item-desc" style="font-size: 12px;\n            margin-top: 10px;\n            transition: .3s;padding-left: 45px;">\n                These trackers are used for activities that are strictly necessary to operate or deliver the\n                service you requested from us and, therefore, do not require you to consent.\n      \n                <div class="cookie-data-container" style="background:rgb(219 223 240)\n                ;padding:15px;margin-top:10px;display:none; border-radius:8px">\n               \n               ${t.generateCookiesHtml(
                    e
                )}\n               \n                </div>\n            </div>\n      \n      \n        </div>`;
            }),
                (o.innerHTML = i);
        };
        isCookieSelected = (t) =>
            "" == e.getMyCookie("zcconsent") || "rejected" == e.getMyCookie("zcconsent")
                ? ""
                : "accepted" == e.getMyCookie("zcconsent")
                ? "checked"
                : "acceptedCustomized" == e.getMyCookie("zcconsent")
                ? e.getMyCookie("zcconsentTarget").split(",").indexOf(t) < 0
                    ? ""
                    : "checked"
                : "";
        showFloatingIcon = (e = "block") => {
            if ("1" == this.settings.revisit_consent_button) {
                const o = this.settings["revisit-consent-bg"],
                    i = this.settings.text_on_hover,
                    n = document.createElement("div");
                var t = document.querySelector(".floating-icon-main-div");
                if (null == t) {
                    const t = `\n                <div class="floating-icon-main-div ${this.settings.position}" style="position: fixed;\n                display:${e};\n                z-index:999999;\n                \n                bottom: 25px;">\n                <div class="floating-cookie-icon-div" style="font-size: 32px;\n                background: ${o} ;\n                border-radius: 50%;\n                width: 55px;\n                cursor:pointer;\n                color: white;\n                display: flex;\n                height: 55px;\n                justify-content: center;\n                align-items: center;"> \n                <i class="fa-solid fa-cookie-bite"></i>\n                </div>\n            \n                <div class="cookie-tooltip" style="\n                display:none;\n                \n                background: #172c54;\n                ">${i}  </div>\n                </div>\n                \n                `;
                    (n.innerHTML = t), document.querySelector("body").appendChild(n);
                } else t.style.display = e;
            }
        };
    }
    (window.zccConf = window.zccConf || {}),
        (window.ZenchiCookieConsentLib = new (class {
            constructor() {
                e.consoleLog("Zenchi Cookie Consent Initiated");
            }
            init(i) {
                this.addStyle(), this.addScript("https://kit.fontawesome.com/cffed4b148.js"), null == sessionStorage.getItem("uccIpdetails") && this.addScript("https://ip-api.com/json?callback=ZenchiCookieConsentLib.getip");
                let s = (Math.random() + 1).toString(36).substring(7);
                var c = document.currentScript.src;
                (c = c.replace("script.js", "classified_cookies.json?r=" + s)), e.consoleLog(c), (i = e.httpGet(c));
                let a = JSON.parse(i);
                (a.script = c),
                    (i = JSON.stringify(a)),
                    (window.domInclude = new n(i)),
                    domInclude.init(),
                    (window.scriptHandler = new t(i)),
                    (window.cookieHandler = new o(i)),
                    ("" == e.getMyCookie("zcconsent") && "" == e.getMyCookie("zcccpaCookies")) || (cookieHandler.init(), "" != e.getMyCookie("zcconsent") && scriptHandler.init());
            }
            addStyle() {
                var e = document.createElement("style");
                e.type = "text/css";
                var t =
                    '.ccshowOverlay{display:block!important;}.cchideOverlay{display:none!important;}.ccshow{display:block!important;animation:1s fadeIn;-webkit-animation:1s fadeIn;-moz-animation:1s fadeIn;-o-animation:1s fadeIn;-ms-animation:fadeIn 1s}.cookies-modal{}.cookies-overlay.ccshow{display:block!important;}.cookies-overlay.hide{display:none!important;}.floating-icon-main-div .cookie-tooltip{width: max-content;padding-top: 5px;position: absolute;right: 25px;border-radius: 3px;top: 10px;color: white;background: rgb(23, 44, 84);padding-bottom: 5px;word-break: revert;white-space: nowrap;padding: 0 10px;}.floating-icon-main-div.left .cookie-tooltip:after{content:"";position:absolute;left:0;top:50%;width:0;height:0;border:7px solid transparent;border-right-color:#172c54;border-left:0;margin-top:-7px;margin-left:-7px}.floating-icon-main-div.right .cookie-tooltip:after{content:"";position:absolute;right:0;top:50%;width:0;height:0;border:7px solid transparent;border-left-color:#172c54;border-right:0;margin-top:-7px;margin-right:-7px} .floating-icon-main-div.left{left:25px;}.floating-icon-main-div.right{right:25px;}.floating-icon-main-div.right .cookie-tooltip{right: 70px;}.floating-icon-main-div.left .cookie-tooltip{left: 70px;}.ccmodal-top-left.ccshow,.ccmodal-top-right.ccshow,.ccmodal-bottom-left.ccshow,.ccmodal-bottom-right.ccshow{transform: translate(0,0) scale(1);}.ccmodal-popup-middle.ccshow{transform: translate(-50%, -50%) scale(1);top: 50%;left: 50%;display:block!important;}.ccmodal-top-left{top:15px;left:15px;right:inherit;bottom:inherit;transform: translate(-50%, -50%) scale(0);}.ccmodal-bottom-left{transform: translate(-50%, -50%) scale(0);bottom:15px;left:15px;right:inherit;top:inherit;}.ccmodal-top-right{top:15px;right:15px;left:inherit;bottom:inherit;transform: translate(-50%, -50%) scale(0);}.ccmodal-bottom-right{bottom:15px;right:15px;left:inherit;top:inherit;transform: translate(-50%, -50%) scale(0);}.ccmodal-center.ccshow{transform: translate(-50%, -50%) scale(1);}.ccmodal-center{top:50%;left: 50%;transform: translate(-50%, -50%) scale(0);right:inherit;bottom:inherit;}.switch{position:relative;display:inline-block;width:48px;height:22px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.slider:before{position:absolute;content:"";height:15px;width:15px;left:4px;bottom:4px;background-color:#48437d;-webkit-transition:.4s;transition:.4s}input:checked+.slider{background-color:#2196f3}input:focus+.slider{box-shadow:0 0 1px #2196f3}input:checked+.slider:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.fade-in-text{font-family:Arial;font-size:60px;animation:5s fadeIn;-webkit-animation:5s fadeIn;-moz-animation:5s fadeIn;-o-animation:5s fadeIn;-ms-animation:fadeIn 5s}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@-moz-keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@-webkit-keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@-o-keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@-ms-keyframes fadeIn{0%{opacity:0}100%{opacity:1}}';
                if (window.attachEvent && !window.opera) e.styleSheet.cssText = t;
                else {
                    var o = document.createTextNode(t);
                    e.appendChild(o);
                }
                document.getElementsByTagName("head")[0].appendChild(e);
            }
            addScript(e) {
                var t = document.createElement("script");
                (t.type = "text/javascript"), (t.crossorigin = "anonymous"), (t.src = e), document.head.appendChild(t);
            }
            getip(e) {
                var t = JSON.stringify(e);
                sessionStorage.setItem("uccIpdetails", t);
            }
        })()),
        ZenchiCookieConsentLib.init(zccConf);
})();
