//const a2020adminBarPreferences = JSON.parse(admin2020_admin_bar_ajax.preferences);
const a2020optionsObject = JSON.parse(a2020_settings_app_ajax.optionsObject);
var mediaUploader;

console.log(a2020optionsObject);

const a2020settings = {
  data() {
    return {
      loading: true,
      screenWidth: window.innerWidth,
      settings: a2020optionsObject,
      activeTab: "admin2020_admin_bar",
      search: {
        string: "",
      },
    };
  },
  created: function () {
    window.addEventListener("resize", this.getScreenWidth);
  },
  computed: {
    filteredSearch() {
      return this.search.results;
    },
  },
  mounted: function () {},
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
    chooseImage(theOption) {
      mediaUploader = wp.media.frames.file_frame = wp.media({
        title: "Choose Image",
        button: {
          text: "Choose Image",
        },
        multiple: false,
      });
      mediaUploader.on("select", function () {
        var attachment = mediaUploader.state().get("selection").first().toJSON();
        theOption.value = attachment.url;
      });
      mediaUploader.open();
    },
  },
};

const a2020adminSettings = a2020Vue.createApp(a2020settings);

a2020adminSettings.mount("#a2020-settings-app");
