<template>
  <div class="scroll-container-for-footer-logic">
    <footer ref="growingFooterRef" class="growing-footer">
      <div class="footer-background-text-container">
        <h1 ref="footerTextRef" class="footer-background-text">CONTACT</h1>
      </div>
      <div ref="footerContentRef" class="footer-actual-content">
        <div class="main-contact-info">
          <a href="mailto:milesxwalkerstudio@gmail.com" class="email-address">milesxwalkerstudio@gmail.com</a>
          <div class="social-media-links">
            <a href="https://www.instagram.com/milesxwalker/" target="_blank" rel="noopener noreferrer" class="social-link">INSTAGRAM</a>
            <a href="https://www.youtube.com/channel/UCWsm3OC_I_S572PVoz85CBg" target="_blank" rel="noopener noreferrer" class="social-link">YOUTUBE</a>
          </div>
        </div>
        <div class="copyright-info">
          <p>&copy; {{ currentYear }} Miles X Walker Studio. ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';

const props = defineProps({
  contactSectionSelector: {
    type: String,
    required: true,
    validator: (value) => value.trim() !== '',
  }
});

const growingFooterRef = ref(null);
const footerTextRef = ref(null);
const footerContentRef = ref(null);
const contactSectionElement = ref(null);

const currentYear = computed(() => new Date().getFullYear());

// --- 动画参数 ---
const MAX_FOOTER_HEIGHT_VH = 100;
const INITIAL_FOOTER_HEIGHT_VH = 0;
const TEXT_INITIAL_FONT_SIZE_VW = 8;
const TEXT_MAX_FONT_SIZE_VW = 28;
const TEXT_INITIAL_OPACITY = 0.05;
const TEXT_MAX_OPACITY = 0.6;
const CONTENT_INITIAL_OPACITY = 0;
const CONTENT_FINAL_OPACITY = 1;
const CONTENT_APPEAR_THRESHOLD = 0.40;

const handleScroll = () => {
  if (!growingFooterRef.value || !footerTextRef.value || !footerContentRef.value) {
    return;
  }

  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const maxScroll = docHeight - windowHeight;

  // 只在距离底部一屏高度内才生长
  const TRIGGER_ZONE_PX = window.innerHeight;
  let growthPercentage = 0;
  if (scrollTop >= maxScroll - TRIGGER_ZONE_PX) {
    growthPercentage = Math.min(1, (scrollTop - (maxScroll - TRIGGER_ZONE_PX)) / TRIGGER_ZONE_PX);
  }

  if (growthPercentage > 0) {
    growingFooterRef.value.style.visibility = 'visible';
    growingFooterRef.value.style.opacity = '1';
  } else {
    growingFooterRef.value.style.visibility = 'hidden';
    growingFooterRef.value.style.opacity = '0';
  }

  // 动态高度
  const currentFooterHeightVh = INITIAL_FOOTER_HEIGHT_VH + (MAX_FOOTER_HEIGHT_VH - INITIAL_FOOTER_HEIGHT_VH) * growthPercentage;
  growingFooterRef.value.style.height = `${currentFooterHeightVh}vh`;

  // 动态字体
  const currentFontSizeVw = TEXT_INITIAL_FONT_SIZE_VW + (TEXT_MAX_FONT_SIZE_VW - TEXT_INITIAL_FONT_SIZE_VW) * growthPercentage;
  footerTextRef.value.style.fontSize = `${currentFontSizeVw}vw`;
  footerTextRef.value.style.opacity = `${TEXT_INITIAL_OPACITY + (TEXT_MAX_OPACITY - TEXT_INITIAL_OPACITY) * growthPercentage}`;
  const baseLetterSpacing = 1;
  const maxAddedLetterSpacing = 25;
  footerTextRef.value.style.letterSpacing = `${baseLetterSpacing + (maxAddedLetterSpacing * growthPercentage)}px`;

  // 内容渐显
  if (growthPercentage > CONTENT_APPEAR_THRESHOLD) {
    const contentGrowthFactor = Math.min(1, (growthPercentage - CONTENT_APPEAR_THRESHOLD) / (1 - CONTENT_APPEAR_THRESHOLD));
    footerContentRef.value.style.opacity = `${CONTENT_INITIAL_OPACITY + (CONTENT_FINAL_OPACITY - CONTENT_INITIAL_OPACITY) * contentGrowthFactor}`;
    const initialContentOffsetYPercent = 2;
    const currentContentOffsetYPercent = initialContentOffsetYPercent * (1 - contentGrowthFactor);
    footerContentRef.value.style.top = `calc(50% + ${currentContentOffsetYPercent}%)`;
  } else {
    footerContentRef.value.style.opacity = `${CONTENT_INITIAL_OPACITY}`;
    footerContentRef.value.style.top = `calc(50% + 2%)`;
  }
};

onMounted(async () => {
  await nextTick();
  if (props.contactSectionSelector) {
    contactSectionElement.value = document.querySelector(props.contactSectionSelector);
    if (!contactSectionElement.value) {
      console.warn(`[Footer] Contact section with selector "${props.contactSectionSelector}" not found. Footer animation might not trigger correctly.`);
    }
  } else {
     console.error("[Footer] Critical: 'contactSectionSelector' prop is required and was not provided or is empty.");
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.growing-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #E0E0E0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  height: 0vh; 
  visibility: hidden; 
  opacity: 0; 
  transition: height 0.55s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.35s ease-out, 
              visibility 0s linear 0.35s;
}
.growing-footer[style*="opacity: 0"] {
  transition: height 0.55s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.35s ease-out, 
              visibility 0s linear 0.35s;
}
.growing-footer[style*="opacity: 1"] {
   transition: height 0.55s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.35s ease-out, 
              visibility 0s linear 0s;
}
.footer-background-text-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.footer-background-text {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 700; 
  color: #FFFFFF; 
  text-transform: uppercase;
  margin: 0;
  position: absolute;
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%); 
  white-space: nowrap;
  line-height: 0.8; 
  user-select: none;
  opacity: 0.05; 
  transition: font-size 0.55s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.5s ease-out, 
              letter-spacing 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}
.footer-actual-content {
  position: absolute;
  left: 50%;
  top: calc(50% + 2%);
  transform: translate(-50%, -50%); 
  text-align: center;
  z-index: 2;
  opacity: 0; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  gap: 28px; 
  padding: 30px 20px;
  width: 90%;
  max-width: 600px; 
  transition: opacity 0.5s 0.15s ease-out, 
              top 0.55s cubic-bezier(0.4, 0, 0.2, 1); 
}
.main-contact-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px; 
}
.email-address {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: clamp(1.1em, 2.8vw, 1.5em); 
  color: #333333; 
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
}
.email-address:hover {
  color: #000000;
  border-bottom-color: #333333;
}
.social-media-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px 25px; 
  margin-top: 8px;
}
.social-link {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: clamp(0.85em, 2.2vw, 1em);
  color: #555555; 
  text-decoration: none;
  font-weight: 400;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  transition: color 0.3s ease;
  padding: 3px 5px;
}
.social-link:hover {
  color: #000000;
}
.copyright-info {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: clamp(0.7em, 1.8vw, 0.8em);
  color: #777777; 
  margin-top: 20px; 
  letter-spacing: 0.5px;
  width: 100%;
  text-align: center;
}
.copyright-info p {
  margin: 0;
}
</style>
