const uipAdminBarSettings = JSON.parse(admin2020_admin_bar_ajax.options);

const uipAdminBar = {
  data() {
    return {
      loading: true,
      screenWidth: window.innerWidth,
      settings: uipAdminBarSettings,
    };
  },
  watch: {},
  created: function () {
    window.addEventListener("resize", this.getScreenWidth);
  },
  computed: {},
  mounted: function () {
    window.setInterval(() => {
      ///TIMED FUNCTIONS
    }, 15000);
    this.loading = false;
  },
  methods: {
    getScreenWidth() {
      this.screenWidth = window.innerWidth;
    },
    isSmallScreen() {
      if (this.screenWidth < 1000) {
        return true;
      } else {
        return false;
      }
    },
    customBackGround() {
      let self = this;
      darkMode = self.settings.defaults.user.prefs.darkMode;
      if (darkMode == true || darkMode == "true") {
        if (self.settings.user["dark-background"]) {
          return self.settings.user["dark-background"];
        }
      } else {
        if (self.settings.user["light-background"]) {
          return self.settings.user["light-background"];
        }
      }
    },
    checkTextColor() {
      let self = this;
      darkMode = self.settings.defaults.user.prefs.darkMode;
      if (darkMode == true || darkMode == "true") {
        return "a2020_night_mode uk-light";
      } else {
        if (self.settings.user["force-light-text"] == true || self.settings.user["force-light-text"] == "true") {
          return "a2020_night_mode uk-light";
        }
      }
    },
    showLegacy() {
      let self = this;
      legacyDisabled = self.settings.user["legacy-admin"];
      prefs = self.settings.defaults.user.prefs.legacyAdmin;
      if (legacyDisabled == "" || legacyDisabled == null) {
        if (prefs == "false" || prefs === false || prefs == "") {
          return true;
        } else {
          return false;
        }
      }
      if (legacyDisabled == "true" || legacyDisabled === true) {
        return false;
      }
      if (prefs == "false" || prefs === false || prefs == "") {
        return true;
      }
      return false;
    },
    getDataFromEmit(data) {
      return data;
    },
  },
};
const uipToolbarApp = a2020Vue.createApp(uipAdminBar);

uipToolbarApp.component("toolbar-logo", {
  props: {
    settings: Object,
  },
  data: function () {
    return {
      loading: true,
    };
  },
  mounted: function () {
    this.loading = false;
  },
  methods: {
    getLogo() {
      if (this.settings.user["light-logo"]) {
        return this.settings.user["light-logo"];
      } else {
        return this.settings.defaults.logo;
      }
    },
    getDarkLogo() {
      if (this.settings.user["dark-logo"]) {
        return this.settings.user["dark-logo"];
      } else {
        return this.settings.defaults.darkLogo;
      }
    },
    isTrue(thetest) {
      if (thetest == "true" || thetest == true) {
        return true;
      }
      if (thetest == "false" || thetest == false || thetest == "") {
        return false;
      }
    },
  },
  template:
    '<div class="uk-flex uk-flex-row uk-flex-middle">\
        <div class="uk-margin-right">\
            <a v-if="!loading" :href="settings.defaults.adminHome" >\
                <img v-if="!isTrue(settings.defaults.user.prefs.darkMode)"  style="max-height:33px" :src="getLogo()">\
                <img v-if="isTrue(settings.defaults.user.prefs.darkMode)" style="max-height:33px" :src="getDarkLogo()">\
            </a>\
            <a v-if="loading" href="#">\
                <div class="uk-border-circle uk-background-muted" style="height:35px;width:35px;"></div>\
            </a>\
        </div>\
        <div class="uk-margin-right" v-if="settings.user[\'show-site-logo\'] == \'true\'" >\
          <span class="uk-text-bold uk-text-default">{{settings.defaults.siteName}}</span>\
        </div>\
    </div>',
});

uipToolbarApp.component("loading-placeholder", {
  props: {
    settings: Object,
  },
  data: function () {
    return {
      loading: true,
    };
  },
  mounted: function () {
    this.loading = false;
  },
  methods: {},
  template:
    '<svg role="img" width="400" height="200" style="width:100%" aria-labelledby="loading-aria" viewBox="0 0 400 200" preserveAspectRatio="none">\
      <title id="loading-aria">Loading...</title>\
      <rect x="0" y="0" width="100%" height="100%" clip-path="url(#clip-path)" style=\'fill: url("#fill");\'></rect>\
      <defs>\
        <clipPath id="clip-path">\
          <rect x="0" y="18" rx="2" ry="2" width="211" height="16" />\
          <rect x="0" y="47" rx="2" ry="2" width="120" height="16" />\
          <rect x="279" y="47" rx="2" ry="2" width="120" height="16" />\
          <rect x="0" y="94" rx="2" ry="2" width="211" height="16" />\
          <rect x="0" y="123" rx="2" ry="2" width="120" height="16" />\
          <rect x="279" y="123" rx="2" ry="2" width="120" height="16" />\
          <rect x="0" y="173" rx="2" ry="2" width="211" height="16" />\
          <rect x="0" y="202" rx="2" ry="2" width="120" height="16" />\
          <rect x="279" y="202" rx="2" ry="2" width="120" height="16" />\
        </clipPath>\
        <linearGradient id="fill">\
          <stop offset="0.599964" stop-color="#bbbbbb2e" stop-opacity="1">\
            <animate attributeName="offset" values="-2; -2; 1" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>\
          </stop>\
          <stop offset="1.59996" stop-color="#bbbbbb2e" stop-opacity="1">\
            <animate attributeName="offset" values="-1; -1; 2" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>\
          </stop>\
          <stop offset="2.59996" stop-color="#bbbbbb2e" stop-opacity="1">\
            <animate attributeName="offset" values="0; 0; 3" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>\
          </stop>\
        </linearGradient>\
      </defs>\
  </svg>',
});

uipToolbarApp.component("toolbar-search", {
  props: {
    settings: Object,
  },
  data: function () {
    return {
      loading: true,
      search: {
        open: false,
        term: "",
        perPage: 10,
        currentPage: 1,
        results: [],
        totalFound: 0,
        categorized: [],
        nothingFound: false,
      },
    };
  },
  mounted: function () {
    this.loading = false;
  },
  computed: {
    searchedCats() {
      return this.search.categorized;
    },
  },
  methods: {
    masterSearch() {
      adminbar = this;
      searchString = this.search.term;
      perpage = this.search.perPage;
      currentpage = this.search.currentPage;
      this.search.loading = true;
      this.search.nothingFound = false;

      jQuery.ajax({
        url: admin2020_admin_bar_ajax.ajax_url,
        type: "post",
        data: {
          action: "a2020_master_search",
          security: admin2020_admin_bar_ajax.security,
          search: searchString,
          perpage: perpage,
          currentpage: currentpage,
        },
        success: function (response) {
          adminbar.search.loading = false;
          if (response) {
            data = JSON.parse(response);
            if (data.error) {
              UIkit.notification(data.error_message, "danger");
            } else {
              adminbar.search.results = data.founditems;
              adminbar.search.totalPages = data.totalpages;
              adminbar.search.totalFound = data.totalfound;
              adminbar.search.categorized = data.categorized;

              if (data.totalpages == 0) {
                adminbar.search.nothingFound = true;
                return;
              }

              if (adminbar.search.currentPage > data.totalpages) {
                adminbar.search.currentPage = 1;
                adminbar.masterSearch();
              }
            }
          }
        },
      });
    },
    loadMoreResults() {
      perpage = this.search.perPage;
      this.search.perPage = Math.floor(perpage * 3);
      this.masterSearch();
    },
    openSearch() {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      this.search.open = true;
    },
    closeSearch() {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      this.search.open = false;
    },
    isEnabled() {
      search = this.settings.user["search-enabled"];

      if (search == "true" || search === true) {
        return false;
      }

      return true;
    },
  },
  template:
    '<div v-if="isEnabled()" class="uk-flex uk-flex-row uk-flex-middle uk-flex-center" style="height:100%">\
       <button @click="openSearch()"\
       :uk-tooltip="\'title:\' +  settings.translations.searchSite"\
       class="uk-button uk-button-default uk-background-muted-opaque uk-border-rounded uk-flex uk-flex-middle" style="padding:5px;border:none">\
          <span class="material-icons-outlined uk-text-muted" style="font-size:20px;">search</span>\
       </button>\
    </div>\
    <div v-if="search.open" class="uk-position-fixed uk-width-1-1 uk-height-viewport hidden" \
    style="background:rgba(0,0,0,0.3);z-index:99999;top:0;left:0;right:0;backdrop-filter: blur(1px);max-height:100vh" \
    :class="{\'nothidden\' : search.open}">\
      <!-- MODAL GRID -->\
      <div class="uk-grid uk-grid-collapse">\
        <div class="uk-width-expand uk-visible@m" @click="closeSearch()" ></div>\
        <div class="uk-width-1-1@s uk-width-auto@m" >\
          <div class="uk-width-xlarge uk-background-default uk-padding uk-overflow-auto" uk-height-viewport style="max-height: 100vh;">\
            <!-- SEARCH TITLE -->\
            <div class="uk-flex uk-flex-between">\
              <div class="uk-h4 uk-margin-remove-top uk-text-bold">{{settings.translations.search}}</div>\
              <div class="">\
                <div @click="search.open = false"\
                 class="uk-button uk-button-default uk-background-muted uk-border-rounded uk-flex uk-flex-middle" style="padding:5px;border:none">\
                    <span class="material-icons-outlined uk-text-muted" style="font-size:18px;">close</span>\
                 </div>\
              </div>\
            </div>\
            <!-- SEARCH -->\
            <div class="uk-inline uk-margin-bottom" style="width:100%;">\
              <span class="uk-form-icon material-icons uk-margin-small-right">search</span>\
              <input class="uk-input a2020-muted-input"\
              v-on:keyup.enter="masterSearch()"\
              v-model="search.term" style="border:none;" type="search" autofocus>\
              <span class="uk-position-right" style="padding:10px;">\
                <div uk-spinner="ratio: 0.7" style="display: none;"></div>\
              </span>\
            </div>\
            <!-- SEARCH RESULTS -->\
            <loading-placeholder v-if="search.loading"></loading-placeholder>\
            <loading-placeholder v-if="search.loading"></loading-placeholder>\
            <div v-if="search.nothingFound" class="uk-flex uk-flex-middle uk-flex-center uk-height-medium">\
              <span class="uk-text-muted">{{settings.translations.nothingFound}}</span>\
            </div>\
            <template v-for="cat in searchedCats" v-if="!search.loading">\
              <div class="uk-h5 uk-margin-remove-top uk-background-muted uk-border-rounded uk-text-muted uk-margin-small-bottom" style="padding: 10px;">{{cat.label}}</div>\
              <div class="cat-area uk-margin-small-bottom" style="padding:10px;">\
                <template v-for="foundItem in cat.found" v-if="!search.loading">\
                  <div class="a2020-found-item uk-margin-small-bottom">\
                    <div class="uk-grid uk-grid-small">\
                      <div class="uk-width-auto  ">\
                        <img v-if="foundItem.image" :src="foundItem.image" style="height:26px;border-radius: 4px;">\
                        <span v-if="foundItem.attachment && !foundItem.image" class="a2020-post-label" style="display: block;">{{foundItem.mime}}</span>\
                        <span v-if="!foundItem.attachment && !foundItem.image" class="a2020-post-label" :class="foundItem.status" style="display: block;">{{foundItem.status}}</span>\
                      </div>\
                      <div class="uk-width-expand uk-flex uk-flex-middle">\
                        <a class="uk-text-bold uk-margin-small-right uk-link-muted" :href="foundItem.editUrl" v-html="foundItem.name"></a>\
                        <div>\
                        </div>\
                      </div>\
                      <div class="uk-width-auto a2020-search-actions">\
                        <a :href="foundItem.editUrl" :uk-tooltip="\'title:\' +  settings.translations.edit" class="uk-button uk-button-small uk-flex-middle uk-background-muted" style="height: 26px;display: inline-flex">\
                          <span class="material-icons" style="font-size: 18px;">edit_note</span>\
                        </a>\
                      </div>\
                      <div class="uk-width-auto a2020-search-actions">\
                        <a :href="foundItem.url" :uk-tooltip="\'title:\' +  settings.translations.view" class="uk-button uk-button-small uk-flex-middle uk-background-muted" style="height: 26px;display: inline-flex">\
                          <span class="material-icons" style="font-size: 18px;">pageview</span>\
                        </a>\
                      </div>\
                    </div>\
                  </div>\
                </template>\
              </div>\
            </template>\
            <!-- LOAD MORE -->\
            <div class="uk-width-1-1 uk-margin-top" v-if="search.totalPages > 1">\
              <button class="uk-button uk-button-secondary uk-button-small  uk-width-1-1" @click="loadMoreResults">\
                <span>{{settings.translations.showMore}}</span>\
                <span>({{search.totalFound - search.results.length}}</span>\
                <span>{{settings.translations.otherMatches}})</span>\
              </button>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>',
});

uipToolbarApp.component("toolbar-links", {
  props: {
    settings: Object,
  },
  data: function () {
    return {
      loading: true,
    };
  },
  mounted: function () {
    this.loading = false;
  },
  computed: {},
  methods: {
    toggleScreenMeta() {
      jQuery("#screen-meta").toggleClass("a2020_open_sc");
    },
    isEnabled() {
      search = this.settings.user["view-enabled"];

      if (search == "true" || search === true) {
        return false;
      }

      return true;
    },
    isfront() {
      front = this.settings.defaults.front;
      if (front == "true" || front === true) {
        return true;
      }
      return false;
    },
    showScreenOptions() {
      screen = this.settings.defaults.user.prefs.screenOptions;
      if (screen == "true" || screen === true) {
        if (!this.isfront()) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
  },
  template:
    '<div class="uk-flex uk-flex-row uk-flex-middle uk-flex-center uk-margin-small-left" style="height:100%">\
      <a v-if="isEnabled() && !isfront()" :href="settings.defaults.siteHome"\
      :uk-tooltip="\'title:\' +  settings.translations.viewSite"\
      class="uk-button uk-button-default uk-background-muted-opaque uk-border-rounded uk-flex uk-flex-middle" style="padding:5px;border:none">\
        <span class="material-icons-outlined uk-text-muted" style="font-size:20px;">house</span>\
      </a>\
      <a v-if="isEnabled() && isfront()" :href="settings.defaults.adminHome"\
      :uk-tooltip="\'title:\' +  settings.translations.viewDashboard"\
      class="uk-button uk-button-default uk-background-muted-opaque uk-border-rounded uk-flex uk-flex-middle" style="padding:5px;border:none">\
        <span class="material-icons-outlined uk-text-muted" style="font-size:20px;">dashboard</span>\
      </a>\
      <button v-if="showScreenOptions()"\
      @click="toggleScreenMeta()" \
      :uk-tooltip="\'title:\' +  settings.translations.screenOptions"\
      class="uk-button uk-button-default uk-background-muted-opaque uk-border-rounded uk-flex uk-flex-middle uk-margin-small-left" \
      style="padding:5px;border:none">\
        <span class="material-icons-outlined uk-text-muted" style="font-size:20px;">tune</span>\
      </button>\
    </div>',
});

uipToolbarApp.component("toolbar-create", {
  props: {
    settings: Object,
  },
  data: function () {
    return {
      loading: true,
      create: {
        open: false,
        types: [],
        loading: false,
      },
    };
  },
  mounted: function () {
    this.loading = false;
  },
  computed: {
    postTypes() {
      return this.create.types;
    },
  },
  methods: {
    openCreate() {
      let self = this;
      if (self.create.types.length === 0) {
        self.getPostTypes();
      }
      self.create.open = true;
    },
    getPostTypes() {
      adminbar = this;
      adminbar.create.loading = true;

      jQuery.ajax({
        url: admin2020_admin_bar_ajax.ajax_url,
        type: "post",
        data: {
          action: "uipress_get_create_types",
          security: admin2020_admin_bar_ajax.security,
        },
        success: function (response) {
          if (response) {
            data = JSON.parse(response);
            adminbar.create.loading = false;
            if (data.error) {
              UIkit.notification(data.error_message, "danger");
            } else {
              adminbar.create.types = data.types;
            }
          }
        },
      });
    },
    isEnabled() {
      search = this.settings.user["new-enabled"];

      if (search == "true" || search === true) {
        return false;
      }

      return true;
    },
  },
  template:
    '<div v-if="isEnabled()" class="uk-flex uk-flex-row uk-flex-middle uk-flex-center uk-margin-small-left" style="height:100%">\
      <button @click="openCreate()"\
      class="uk-button uk-button-secondary uk-light uk-border-rounded uk-flex uk-flex-middle" style="padding:5px 10px;border:none">\
        <span class=" uk-text-small" style="margin-right:5px;color:#fff">{{settings.translations.create}}</span>\
        <span class="material-icons-outlined" style="font-size:16px;color:#fff">chevron_right</span>\
      </button>\
    </div>\
    <div v-if="create.open" class="uk-position-fixed uk-width-1-1 uk-height-viewport hidden" \
    style="background:rgba(0,0,0,0.3);z-index:99999;top:0;left:0;right:0;backdrop-filter: blur(1px);max-height:100vh" \
    :class="{\'nothidden\' : create.open}">\
      <!-- MODAL GRID -->\
      <div class="uk-grid uk-grid-collapse">\
        <div class="uk-width-expand uk-visible@m" @click="create.open = false" ></div>\
        <div class="uk-width-1-1@s uk-width-auto@m" >\
          <div class="uk-width-large uk-background-default uk-padding uk-overflow-auto" uk-height-viewport style="max-height: 100vh;">\
            <!-- MODAL TITLE -->\
            <div class="uk-flex uk-flex-between">\
              <div class="uk-h4 uk-margin-remove-top uk-text-bold">{{settings.translations.createNew}}</div>\
              <div class="">\
                <div @click="create.open = false"\
                 class="uk-button uk-button-default uk-background-muted uk-border-rounded uk-flex uk-flex-middle" style="padding:5px;border:none">\
                    <span class="material-icons-outlined uk-text-muted" style="font-size:18px;">close</span>\
                 </div>\
              </div>\
            </div>\
            <div v-if="create.loading" class="uk-margin-top">\
              <loading-placeholder ></loading-placeholder>\
            </div>\
            <div class="uk-margin-top">\
              <template v-for="type in postTypes">\
                <a :href="type.href" class="uk-flex uk-flex-row uk-flex-middle uk-margin-bottom uk-link-muted" style="padding:0 5px">\
                  <span class="uk-border-circle uk-background-secondary uk-light uk-margin-right uk-text-center" \
                  style="width:20px;height:20px;padding:3px;">\
                    <span v-if="type.icon" class="dashicons uk-text-small uk-text-primary" :class="type.icon"></span>\
                    <span  v-if="!type.icon" class="material-icons-outlined uk-text-small uk-text-primary">post_add</span>\
                  </span>\
                  <span class="uk-text-bold uk-margin-small-right uk-flex-1" style="font-size:16px;">{{type.name}}</span>\
                  <span class="material-icons-outlined uk-flex-0">chevron_right</span>\
                </a>\
              </template>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>',
});

uipToolbarApp.component("toolbar-offcanvas", {
  emits: ["updateprefs"],
  props: {
    settings: Object,
  },
  data: function () {
    return {
      loading: true,
      panel: {
        open: false,
      },
      updates: {
        allUpdates: [],
        loading: false,
        updateCount: 0,
      },
      notices: {
        allNotices: [],
        formatted: [],
        loading: false,
        noticeCount: 0,
        supressed: [],
        suppressedForPage: 0,
      },
      prefs: {
        darkMode: this.settings.defaults.user.prefs.darkMode,
        legacyAdmin: this.settings.defaults.user.prefs.legacyAdmin,
        screenOptions: this.settings.defaults.user.prefs.screenOptions,
      },
    };
  },
  watch: {
    "prefs.darkMode": function (newValue, oldValue) {
      if (newValue != oldValue) {
        a2020_save_user_prefences("darkmode", newValue, false);
        this.returnPrefs();

        jQuery(".a2020_dark_anchor").toggleClass("uk-light");
        jQuery("body").toggleClass("a2020_night_mode");
      }
    },
    "prefs.screenOptions": function (newValue, oldValue) {
      if (newValue != oldValue) {
        this.returnPrefs();
        a2020_save_user_prefences("screen_options", newValue, false);
      }
    },
    "prefs.legacyAdmin": function (newValue, oldValue) {
      if (newValue != oldValue) {
        this.returnPrefs();
        a2020_save_user_prefences("legacy_admin_links", newValue, false);
      }
    },
  },
  mounted: function () {
    this.loading = false;
  },
  computed: {
    allUpdates() {
      return this.updates.allUpdates;
    },
    formatNotices() {
      let toolbar = this;
      data = jQuery.parseHTML(toolbar.notices.allNotices);
      notis = [];
      supressed = toolbar.notices.supressed;
      toolbar.notices.suppressedForPage = 0;

      jQuery(data).each(function () {
        temp = [];

        text = jQuery(this).text().trim().substring(0, 40);
        html = jQuery(this).prop("outerHTML");

        if (html) {
          if (!supressed.includes(text)) {
            temp["type"] = "primary";
            if (html.includes("notice-error")) {
              temp["type"] = "errormsg";
            }
            if (html.includes("notice-warning")) {
              temp["type"] = "warning";
            }
            if (html.includes("notice-success")) {
              temp["type"] = "success";
            }
            if (html.includes("notice-info")) {
              temp["type"] = "info";
            }

            temp["content"] = html;
            temp["shortDes"] = text;
            temp["open"] = false;
            notis.push(temp);
          } else {
            toolbar.notices.suppressedForPage += 1;
          }
        }
      });
      toolbar.notices.formatted = notis;
      toolbar.notices.noticeCount = notis.length;
      return toolbar.notices.formatted;
    },
  },
  methods: {
    isDisabled(optionName) {
      notifications = this.settings.user[optionName];

      if (notifications == "true" || notifications === true) {
        return false;
      }

      return true;
    },
    getNoticeClass(noticetype) {
      if (noticetype == "info" || noticetype == "primary") {
        return "uk-background-primary-muted";
      }
      if (noticetype == "warning") {
        return "uk-background-warning-muted";
      }
      if (noticetype == "errormsg") {
        return "uk-background-danger-muted";
      }
      if (noticetype == "success") {
        return "uk-background-success-muted";
      }
    },
    hideNotification(des) {
      this.notices.supressed.push(des);
      a2020_save_user_prefences("a2020_supressed_notifications", this.notices.supressed, false);
      UIkit.notification(this.settings.translations.notificationHidden, "success");
    },
    returnPrefs() {
      data = this.prefs;
      this.$emit("updateprefs", data);
    },
    openOffcanvas() {
      let self = this;
      if (self.updates.allUpdates.length === 0) {
        self.getUpdates();
        self.getNotices();
      }
      self.panel.open = true;
    },
    getUpdates() {
      adminbar = this;
      adminbar.updates.loading = true;

      jQuery.ajax({
        url: admin2020_admin_bar_ajax.ajax_url,
        type: "post",
        data: {
          action: "uipress_get_updates",
          security: admin2020_admin_bar_ajax.security,
        },
        success: function (response) {
          if (response) {
            data = JSON.parse(response);
            adminbar.updates.loading = false;
            if (data.error) {
              UIkit.notification(data.error_message, "danger");
            } else {
              adminbar.updates.allUpdates = data.updates;
              adminbar.updates.updateCount = data.total;
            }
          }
        },
      });
    },
    getNotices() {
      adminbar = this;
      adminbar.notices.loading = true;

      jQuery.ajax({
        url: admin2020_admin_bar_ajax.ajax_url,
        type: "post",
        data: {
          action: "uipress_get_notices",
          security: admin2020_admin_bar_ajax.security,
        },
        success: function (response) {
          if (response) {
            data = JSON.parse(response);
            adminbar.notices.loading = false;
            if (data.error) {
              UIkit.notification(data.error_message, "danger");
            } else {
              adminbar.notices.allNotices = data.notices;
              adminbar.notices.supressed = data.supressed;
            }
          }
        },
      });
    },
    isfront() {
      front = this.settings.defaults.front;
      if (front == "true" || front === true) {
        return true;
      }
      return false;
    },
    showLegacy() {
      let self = this;
      legacyDisabled = self.settings.user["legacy-admin"];
      console.log(legacyDisabled);
      if (legacyDisabled == "" || legacyDisabled == null) {
        return true;
      }
      if (legacyDisabled == "true" || legacyDisabled === true) {
        return false;
      }
      return true;
    },
  },
  template:
    '<div class="uk-flex uk-flex-row uk-flex-middle uk-flex-center uk-margin-small-left" style="height:100%">\
      <a @click="openOffcanvas()"\
      class="uk-button uk-button-primary uk-forever-primary uk-border-circle uk-flex uk-flex-middle uk-light uk-flex-center"\
      style="padding:5px;border:none;width:30px;height:30px;">\
        <span class="uk-text-primary" style="font-size:16px;line-height:0;">{{settings.defaults.user.initial}}</span>\
      </a>\
    </div>\
    <div v-if="panel.open" class="uk-position-fixed uk-width-1-1 uk-height-viewport hidden" \
    style="background:rgba(0,0,0,0.3);z-index:99999;top:0;left:0;right:0;backdrop-filter: blur(1px);max-height:100vh" \
    :class="{\'nothidden\' : panel.open}">\
      <!-- MODAL GRID -->\
      <div class="uk-grid uk-grid-collapse">\
        <div class="uk-width-expand uk-visible@m" @click="panel.open = false" ></div>\
        <div class="uk-width-1-1@s uk-width-auto@m" >\
          <div class="uk-width-large uk-background-default uk-padding uk-overflow-auto" uk-height-viewport style="max-height: 100vh;">\
            <!-- MODAL TITLE -->\
            <div class="uk-flex uk-flex-middle">\
              <div class="uk-margin-right">\
                <div class="uk-background-primary uk-border-circle uk-flex uk-flex-middle uk-flex-center uk-light uk-overflow-hidden"\
                style="width:40px;height:40px;">\
                  <span v-if="!settings.defaults.user.img" class="uk-text-primary" style="font-size:20px;">{{settings.defaults.user.initial}}</span>\
                  <img v-if="settings.defaults.user.img" :src="settings.defaults.user.img" style="width:100%;">\
                </div>\
              </div>\
              <div class="uk-flex-1">\
                <div class="uk-h4 uk-margin-remove uk-text-bold">{{settings.defaults.user.username}}</div>\
                <div class="uk-text-meta">{{settings.defaults.user.email}}</div>\
              </div>\
              <div class="">\
                <div @click="panel.open = false"\
                 class="uk-button uk-button-default uk-background-muted uk-border-rounded uk-flex uk-flex-middle" style="padding:5px;border:none">\
                    <span class="material-icons-outlined uk-text-muted" style="font-size:18px;">close</span>\
                 </div>\
              </div>\
            </div>\
            <div v-if="panel.loading" class="uk-margin-top">\
              <loading-placeholder ></loading-placeholder>\
            </div>\
            <!-- QUICK LINKS BLOCK -->\
            <div  class="top uk-grid uk-grid-small" style="margin-top:30px">\
              <div class="uk-width-1-2">\
                <a v-if="!isfront()" :href="settings.defaults.siteHome"\
                class="uk-button uk-button-small uk-width-1-1 uk-button-default uk-button-primary-muted uk-text-muted uk-flex uk-flex-middle"\
                style="padding:5px 10px;border:none;">\
                  <span class="material-icons-outlined uk-margin-small-right" style="font-size:20px">launch</span>\
                  <span class="uk-text-bold ">{{settings.translations.viewSite}}</span>\
                </a>\
                <a v-if="isfront()" :href="settings.defaults.adminHome"\
                class="uk-button uk-button-small uk-width-1-1 uk-button-default uk-button-primary-muted uk-text-muted uk-flex uk-flex-middle"\
                style="padding:5px 10px;border:none;">\
                  <span class="material-icons-outlined uk-margin-small-right" style="font-size:20px">launch</span>\
                  <span class="uk-text-bold ">{{settings.translations.viewDashboard}}</span>\
                </a>\
              </div>\
              <div class="uk-width-1-2">\
                <a :href="settings.defaults.logOut"\
                class="uk-button uk-button-small uk-width-1-1 uk-button-default uk-background-muted uk-text-muted uk-flex uk-flex-middle"\
                style="padding:5px 10px;border:none;">\
                  <span class="material-icons-outlined uk-margin-small-right" style="font-size:20px">logout</span>\
                  <span class="uk-text-bold ">{{settings.translations.logOut}}</span>\
                </a>\
              </div>\
            </div>\
            <!-- UPDATE BLOCK -->\
            <div class="uk-margin-top">\
              <!-- UPDATE HEADER -->\
              <div class="uk-flex uk-flex-middle uk-margin-bottom uk-background-muted uk-border-rounded uk-text-muted" style="padding:10px;">\
                <div class="uk-h5 uk-margin-remove uk-text-muted uk-flex-1">\
                  {{settings.translations.updates}}\
                </div>\
                <div v-if="updates.updateCount > 0" class="a2020-warning-count">\
                  {{updates.updateCount}}\
                </div>\
              </div>\
              <!-- UPDATE LIST -->\
              <loading-placeholder v-if="updates.loading"></loading-placeholder>\
              <div style="padding:0 10px;">\
                <template v-if="!updates.loading" v-for="cat in allUpdates">\
                  <a :href="cat.href" class="uk-flex uk-flex-middle uk-margin-bottom uk-link-text">\
                    <span class="material-icons-outlined uk-margin-small-right" style="font-size:20px;">{{cat.icon}}</span>\
                    <div class="uk-flex-1">\
                      {{cat.title}}\
                    </div>\
                    <div v-if="cat.total > 0" class="a2020-warning-count">\
                      {{cat.total}}\
                    </div>\
                    <div v-if="cat.total == 0" class="">\
                      <span class="material-icons-outlined uk-text-success" style="font-size:20px;">check_circle</span>\
                    </div>\
                  </a>\
                </template>\
              </div>\
            </div>\
            <!-- PREFERENCES BLOCK -->\
            <div class="uk-margin-top">\
              <!-- PREFS HEADER -->\
              <div class="uk-flex uk-flex-middle uk-margin-bottom uk-background-muted uk-border-rounded uk-text-muted" style="padding:10px;">\
                <div class="uk-h5 uk-margin-remove uk-text-muted uk-flex-1">\
                  {{settings.translations.preferences}}\
                </div>\
              </div>\
              <!-- PREFS LIST -->\
              <div style="padding:0 10px;">\
                <!-- DARK MODE -->\
                <div class="uk-flex uk-flex-middle uk-margin-bottom ">\
                  <span class="material-icons-outlined uk-margin-small-right" style="font-size:20px;">dark_mode</span>\
                  <div class="uk-flex-1">\
                    {{settings.translations.darkMode}}\
                  </div>\
                  <div class="">\
                    <label class="admin2020_switch uk-margin-left">\
                      <input type="checkbox" v-model="prefs.darkMode">\
                      <span class="admin2020_slider"></span>\
                    </label>\
                  </div>\
                </div>\
                <!-- SCREEN OPTIONS -->\
                <div class="uk-flex uk-flex-middle uk-margin-bottom ">\
                  <span class="material-icons-outlined uk-margin-small-right" style="font-size:20px;">tune</span>\
                  <div class="uk-flex-1">\
                    {{settings.translations.showScreenOptions}}\
                  </div>\
                  <div class="">\
                    <label class="admin2020_switch uk-margin-left">\
                      <input type="checkbox" v-model="prefs.screenOptions">\
                      <span class="admin2020_slider"></span>\
                    </label>\
                  </div>\
                </div>\
                <!-- LEGACY LINKS OPTIONS -->\
                <div class="uk-flex uk-flex-middle uk-margin-bottom "\
                v-if="showLegacy()">\
                  <span class="material-icons-outlined uk-margin-small-right" style="font-size:20px;">link_off</span>\
                  <div class="uk-flex-1">\
                    {{settings.translations.hideLegacy}}\
                  </div>\
                  <div class="">\
                    <label class="admin2020_switch uk-margin-left">\
                      <input type="checkbox" v-model="prefs.legacyAdmin">\
                      <span class="admin2020_slider"></span>\
                    </label>\
                  </div>\
                </div>\
              </div>\
            </div>\
            <!-- NOTICES BLOCK -->\
            <div v-if="isDisabled(\'notification-center-disabled\')" class="uk-margin-top">\
              <!-- PREFS HEADER -->\
              <div class="uk-flex uk-flex-middle uk-background-muted uk-border-rounded uk-text-muted" style="padding:10px;margin-bottom:30px;">\
                <div class="uk-h5 uk-margin-remove uk-text-muted uk-flex-1">\
                  {{settings.translations.notifications}}\
                </div>\
                <div v-if="notices.noticeCount > 0" class="a2020-warning-count">\
                  {{notices.noticeCount}}\
                </div>\
              </div>\
              <!-- NOTICES LIST -->\
              <div style="">\
                <loading-placeholder v-if="notices.loading"></loading-placeholder>\
                <template v-if="!notices.loading" v-for="notice in formatNotices">\
                  <div class="uk-background-muted uk-border-rounded uk-margin-bottom" style="padding:10px;">\
                    <div class="uk-flex uk-flex-middle">\
                      <span class="uk-margin-small-right" :class="getNoticeClass(notice.type)"\
                      style="height:15px;width:15px;border-radius:50%;"></span>\
                      <div class="uk-margin-remove uk-flex-1 uk-text-bold" v-html="notice.shortDes">\
                      </div>\
                      <span v-if="!notice.open" @click="notice.open = true" class="material-icons-outlined" style="font-size:20px;cursor:pointer">chevron_left</span>\
                      <span v-if="notice.open" @click="notice.open = false" class="material-icons-outlined" style="font-size:20px;cursor:pointer">expand_more</span>\
                    </div>\
                    <div v-if="notice.open" class="uk-margin-top">\
                      <button @click="hideNotification(notice.shortDes)" class="uk-button uk-button-small uk-button-secondary">{{settings.translations.hideNotification}}</button>\
                    </div>\
                    <div v-if="notice.open" class="uk-margin-top">\
                      <div v-html="notice.content"></div>\
                    </div>\
                  </div>\
                </template>\
                <div v-if="notices.suppressedForPage > 0" >\
                  <span>{{notices.suppressedForPage}} {{settings.translations.hiddenNotification}}</span>\
                  <a href="#" @click="notices.supressed = []" >{{settings.translations.showAll}}</a>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>',
});

//import { moduleData } from "/src/loader.min.js";
//uipToolbarApp.component("loading-placeholder", moduleData);
//import { moduleData } from "/src/loader.min.js";

if (jQuery("#uip-admin-bar").length > 0) {
  uipToolbarApp.mount("#uip-admin-bar");
}
