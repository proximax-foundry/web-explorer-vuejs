<template>
  <footer class="z-10 w-full">
    <div class="bg-blue-theme">
      <div class="md:container mx-auto sm:grid-cols-2 lg:grid-cols-4 grid">
        <div class="flex py-10 sm:col-span-2">
          <div class="mx-3 sm:mx-7">
            <img src="@/assets/img/sirius-icon.svg" class="w-7" />
          </div>
          <div>
            <div class="text-xxs sm:text-xs text-white mb-5">
              Copyright © {{ lastActiveYear }}. All Rights Reserved.
            </div>
            <div>
              <p class="media-link">
                <a href="http://t.me/ProximaXio" target="_new"
                  ><font-awesome-icon :icon="faTelegramPlane" class="w-4 h-4"
                /></a>
                <a href="https://twitter.com/ProximaXio" target="_new"
                  ><font-awesome-icon :icon="faTwitter" class="w-4 h-4"
                /></a>
                <a href="https://github.com/proximax-storage" target="_new"
                  ><font-awesome-icon :icon="faGithub" class="w-4 h-4"
                /></a>
                <a href="https://www.instagram.com/proximaxio/" target="_new"
                  ><font-awesome-icon :icon="faInstagram" class="w-4 h-4"
                /></a>
                <a href="https://www.reddit.com/user/ProximaXio/" target="_new"
                  ><font-awesome-icon :icon="faRedditAlien" class="w-4 h-4"
                /></a>
                <a href="https://www.facebook.com/ProximaXio/" target="_new"
                  ><font-awesome-icon :icon="faFacebookF" class="w-4 h-4"
                /></a>
                <a href="https://medium.com/@proximaxio" target="_new"
                  ><font-awesome-icon :icon="faMediumM" class="w-4 h-4"
                /></a>
                <a
                  href="https://www.youtube.com/channel/UCky9HP0VlqsnGQWrbMPFVnw"
                  target="_new"
                  ><font-awesome-icon :icon="faYoutube" class="w-4 h-4"
                /></a>
                <a
                  href="https://www.linkedin.com/company/proximaxio"
                  target="_new"
                  ><font-awesome-icon :icon="faLinkedinIn" class="w-4 h-4"
                /></a>
              </p>
            </div>
            <div class="mt-4 policy-link">
              <a href="https://www.proximax.ltd/en/terms-of-use" target="_new"
                >Terms & Condition</a
              >
              |
              <a href="https://www.proximax.ltd/en/privacy" target="_new"
                >Privacy Policy</a
              >
            </div>
            <div class="text-xs text-gray-500 mt-2">
              Version {{ versioning }}
            </div>
          </div>
        </div>
        <div class="sm:col-span-1 p-3 sm:p-5 md:px-2 md:my-5 mx-1 md:mx-5">
          <div class="text-white text-xs md:text-tsm mb-4">For Developers</div>
          <div class="links">
            <a href="https://bcdocs.xpxsirius.io/" target="=_new"
              >Getting Started</a
            >
            <a href="https://www.proximax.io/en/wallet" target="=_new"
              >Create Sirius Wallet Account</a
            >
            <a href="https://www.proximax.io/en#Tokenomics" target="=_new"
              >Learn More About XPX</a
            >
            <a href="https://www.proximax.io/en#Participate" target="=_new"
              >Become a Node Participant</a
            >
          </div>
        </div>
        <div class="sm:col-span-1 p-3 sm:p-5 md:px-2 md:my-5 mx-1 md:mx-5">
          <div class="text-white text-xs md:text-tsm mb-4">Company</div>
          <div class="links">
            <a
              href="https://www.proximax.io/technology/#Architecture"
              target="_new"
              >Platform</a
            >
            <a href="https://www.proximax.ltd/en" target="_new">About</a>
            <a href="https://blog.proximax.io/en/" target="_new">Blog</a>
            <a href="http://t.me/ProximaXio" target="_new">Support</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import packageData from "../../package.json";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebookF,
  faTelegramPlane,
  faTwitter,
  faGithub,
  faMediumM,
  faInstagram,
  faRedditAlien,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faFacebookF,
  faTelegramPlane,
  faTwitter,
  faGithub,
  faMediumM,
  faInstagram,
  faRedditAlien,
  faYoutube,
  faLinkedinIn
);

const lastActiveYear = BUILD_YEAR;
const versioning = ref("0.0.1");

versioning.value = packageData.version;
</script>

<style lang="scss" scoped>
.media-link {
  a {
    @apply mr-4 text-gray-300 hover:text-white transition-all duration-200;
  }
}

.policy-link {
  @apply text-gray-300;
  a {
    @apply text-xxs sm:text-xs underline hover:text-white hover:no-underline transition-all duration-200;
  }
}

.links {
  @apply text-gray-400 text-xs sm:text-tsm;
  a {
    @apply block mb-1 transition-all duration-200 hover:text-white;
  }
}
</style>
