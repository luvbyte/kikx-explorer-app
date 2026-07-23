<template>
  <div
    class="fscreen overflow-hidden touch-none flex items-center justify-center bg-black"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @pointerleave="onPointerUp"
    @dblclick="reset"
  >
    <img
      :src="src"
      :alt="alt"
      class="select-none pointer-events-none max-w-full max-h-full object-contain"
      draggable="false"
      :style="{
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        transformOrigin: 'center center'
      }"
    />
  </div>
</template>

<script setup>
  import { ref } from "vue";

  defineProps({
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ""
    }
  });

  const scale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);

  const pointers = new Map();

  let startDistance = 0;
  let startScale = 1;

  let dragStartX = 0;
  let dragStartY = 0;

  let dragTranslateX = 0;
  let dragTranslateY = 0;

  const MIN_SCALE = 1;
  const MAX_SCALE = 8;

  const getDistance = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const onPointerDown = e => {
    e.currentTarget.setPointerCapture?.(e.pointerId);

    pointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY
    });

    if (pointers.size === 1) {
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      dragTranslateX = translateX.value;
      dragTranslateY = translateY.value;
    }

    if (pointers.size === 2) {
      const pts = [...pointers.values()];

      startDistance = getDistance(pts[0], pts[1]);
      startScale = scale.value;
    }
  };

  const onPointerMove = e => {
    if (!pointers.has(e.pointerId)) return;

    pointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY
    });

    // Pan only when zoomed in
    if (pointers.size === 1 && scale.value > 1) {
      translateX.value = dragTranslateX + (e.clientX - dragStartX);

      translateY.value = dragTranslateY + (e.clientY - dragStartY);
    }

    // Pinch zoom
    if (pointers.size === 2) {
      const pts = [...pointers.values()];
      const distance = getDistance(pts[0], pts[1]);

      scale.value = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, startScale * (distance / startDistance))
      );
    }
  };

  const onPointerUp = e => {
    pointers.delete(e.pointerId);

    // Snap back when fully zoomed out
    if (scale.value <= 1) {
      reset();
    }
  };

  const reset = () => {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  };
</script>
