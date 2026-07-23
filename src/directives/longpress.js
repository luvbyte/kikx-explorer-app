export default {
  mounted(el, binding) {
    let pressTimer = null;
    let longPressTriggered = false;
    let startX = 0;
    let startY = 0;
    const MOVE_THRESHOLD = 10; // pixels

    const getOptions = () => {
      if (typeof binding.value === "function") {
        return {
          handler: binding.value,
          duration: 600
        };
      }

      return {
        handler: binding.value.handler,
        duration: binding.value.duration || 600
      };
    };

    const start = (e) => {
      const { handler, duration } = getOptions();
      longPressTriggered = false;

      if (e.touches) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }

      pressTimer = setTimeout(() => {
        handler(e);
        longPressTriggered = true;
      }, duration);
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const move = (e) => {
      if (!e.touches || pressTimer === null) return;

      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);

      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        cancel();
      }
    };

    const preventClick = (e) => {
      if (longPressTriggered) {
        e.preventDefault();
        e.stopImmediatePropagation();
        longPressTriggered = false;
      }
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
    };

    // Mouse
    el.addEventListener("mousedown", start);
    el.addEventListener("mouseup", cancel);
    el.addEventListener("mouseleave", cancel);

    // Touch
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);

    el.addEventListener("click", preventClick, true);
    el.addEventListener("contextmenu", preventContextMenu);
  }
};