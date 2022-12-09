<template>
  <div :class="$style.langPosition">
    <button
      type="button"
      :class="[$style.flex, $style['items-center'], $style.langDropdownButton]"
      @click="toggleVisibility"
      @keydown.space.exact.prevent="toggleVisibility"
      @keydown.esc.exact="hideDropdown"
      @keydown.shift.tab="hideDropdown"
      @keydown.up.exact.prevent="startArrowKeys"
      @keydown.down.exact.prevent="startArrowKeys"
    >
      <img
        :src="flagImg($i18n.locale)"
        :alt="`flag ` + $i18n.locale"
        :class="$style.flagShadow"
      />
    </button>
    <transition :name="$style['dropdown-fade']">
      <ul
        v-if="isVisible"
        ref="dropdown"
        v-on-clickaway="hideDropdown"
        :class="$style.langBox"
      >
        <li v-for="(lang, idx) in langs" :key="idx">
          <button
            type="button"
            :class="[$style.flex, $style.langHover]"
            @click.prevent="setLocale(lang.shortName)"
            @keydown.up.exact.prevent
            @keydown.tab.exact="focusNext(false)"
            @keydown.down.exact.prevent="focusNext(true)"
            @keydown.esc.exact="hideDropdown"
          >
            <img
              :src="flagImg(lang.shortName)"
              :alt="lang.longName"
              :class="$style.flag"
            />
            <span :class="$style.localLang">{{ lang.localName }}</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
const flagsImages = import.meta.globEager("/src/assets/flags/*");

export default {
  name: "LanguageSwitcher",
  directives: {
    "on-clickaway": {}
  },
  data() {
    return {
      isVisible: false,
      focusedIndex: 0,
      langs: [
        {
          shortName: "ru",
          longName: "Russian",
          localName: "Русский",
          flag: "/flag_ru.svg"
        },
        {
          shortName: "en",
          longName: "English",
          localName: "English (auto-generated)",
          flag: "/flag_en.svg"
        },
        /*	{
					shortName: "es",
					longName: "Spanish",
					localName: "Español",
					flag: "/flag_es.svg"
				},*/
        {
          shortName: "de",
          longName: "German",
          localName: "Deutsch (automatisch erzeugt)",
          flag: "/flag_de.svg"
        },
        /*{
					shortName: "fr",
					longName: "French",
					localName: "Français",
					flag: "/flag_fr.svg"
				},*/
        {
          shortName: "ja",
          longName: "Japanese",
          localName: "日本語 (自動生成)",
          flag: "/flag_ja.svg"
        }
        /*{
					shortName: "ko",
					longName: "Korean",
					localName: "한국어",
					flag: "/flag_ko.svg"
				},*/
        /*{
					shortName: "zh",
					longName: "Chinese",
					localName: "中文",
					flag: "/flag_zh.svg"
				}*/
      ]
    };
  },
  methods: {
    flagImg(locale) {
      return flagsImages[`/src/assets/flags/flag_${locale}.svg`].default;
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    hideDropdown() {
      this.isVisible = false;
      this.focusedIndex = 0;
    },
    startArrowKeys() {
      if (this.isVisible) {
        this.$refs.dropdown.children[0].children[0].focus();
      }
    },
    focusPrevious(isArrowKey) {
      this.focusedIndex = this.focusedIndex - 1;
      if (isArrowKey) {
        this.focusItem();
      }
    },
    focusNext(isArrowKey) {
      this.focusedIndex = this.focusedIndex + 1;
      if (isArrowKey) {
        this.focusItem();
      }
    },
    focusItem() {
      this.$refs.dropdown.children[this.focusedIndex].children[0].focus();
    },
    setLocale(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("lang", locale);
      // Uncomment the below lines if you need language prefixes to be shown in the URL
      // example: en.website.com (additional router configuration required)
      // this.$router.push({
      //   params: { lang: locale }
      // })
      this.hideDropdown();
    }
  }
};
</script>

<style lang="scss" module>
// Position of language dot
.langPosition {
  z-index: 99999999;
  position: fixed;
  display: flex;
  justify-content: center;
  bottom: 30px;
  left: 30px;
}

// Box that holds all language options
.langBox {
  user-select: none;
  padding: 5px 5px 5px -5px;
  width: max-content;
  box-shadow: 0px 3px 6px rgb(204, 210, 235);
}

ul.langBox {
  text-align: left;
  min-width: 138px;
  border-radius: 8px;
  background: white;
  z-index: 500;
  position: absolute;
  list-style: none;
  // padding: 10px 10px !important;
  margin: 0px !important;
  bottom: 60px;
  left: -10px;

  padding: 10px 0;

  li {
    //padding: 5px 0;
    &:hover {
      background: #eee;
    }

    & + li {
      margin-top: 5px;
    }
  }
}

// Language name text
.localLang {
  font-size: 18px;
  padding-left: 15px;
  font-weight: 400;
  display: block;
}

// Animations
.dropdown-fade {
  &:global(-enter-active),
  &:global(-leave-active) {
    transition: all 0.1s ease-in-out;
  }

  &:global(-fade-enter),
  &:global(-fade-leave-to) {
    opacity: 0;
    transform: translateY(-12px);
  }
}

.langDropdownButton {
  outline: none;
  cursor: pointer !important;
  background-color: transparent !important;
  border: none;
  padding-right: 0px;
}

.shortName {
  margin-top: 5px !important;
}

.flag {
  width: 30px;
}

.flagShadow {
  border-radius: 50px;
  box-shadow: 0px 3px 3px rgb(204, 210, 235);
  width: 35px;
}

.langHover {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  text-decoration: none;
  color: #222;
  transition: all 0.1s ease-in-out;
  width: 100%;

  &:hover {
    color: #007aff;
  }
}
</style>
