import { onMounted, onBeforeUnmount } from 'vue';
export default function (dataFreshCB, intervalStep = 5 * 60 * 1000) {
  const intervalObj = {
    intervalInstance: null,
    intervalStep,
  };
  onMounted(() => {
    startInterval();
  });
  onBeforeUnmount(() => {
    intervalObj.intervalInstance &&
      window.clearInterval(intervalObj.intervalInstance);
  });
  const startInterval = () => {
    intervalObj.intervalInstance = setInterval(() => {
      dataFreshCB(true);
    }, intervalObj.intervalStep);
  };
}
