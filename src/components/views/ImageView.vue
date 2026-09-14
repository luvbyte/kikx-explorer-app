<template>
  <div
    ref="container"
    class="fscreen overflow-hidden touch-none flex flex-col items-center justify-center bg-black relative w-full h-full select-none"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @click="handleClick"
    @dblclick="handleDblClick"
  >
    <img
      ref="image"
      :src="src"
      :alt="alt"
      :class="[
        'max-w-full max-h-full object-contain pointer-events-none',
        !isDragging ? 'transition-transform duration-75 ease-out' : ''
      ]"
      :style="{
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
        transformOrigin: 'center center'
      }"
      draggable="false"
    />
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: "" }
  });
  const emit = defineEmits(["click"]);

  const container = ref(null);
  const image = ref(null);

  const scale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);
  const isDragging = ref(false); // Tracks if the user is currently interacting

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  const pointers = new Map();

  let startDistance = 0;
  let startScale = 1;
  let startTranslateX = 0;
  let startTranslateY = 0;

  let dragStartX = 0;
  let dragStartY = 0;

  let pinchMidX = 0;
  let pinchMidY = 0;

  let clickTimeout = null;

  const SINGLE_CLICK_DELAY = 250;

  const handleClick = event => {
    clearTimeout(clickTimeout);

    clickTimeout = setTimeout(() => {
      emit("click");
    }, SINGLE_CLICK_DELAY);
  };

  const handleDblClick = event => {
    clearTimeout(clickTimeout);

    if (scale.value > 1) {
      reset();
    } else {
      scale.value = 2.5;
    }
  };

  const getDistance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const getCenter = (p1, p2) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  });

  const onPointerDown = e => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    isDragging.value = true; // Disable transitions while fingers are down

    if (pointers.size === 1) {
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      startTranslateX = translateX.value;
      startTranslateY = translateY.value;
    } else if (pointers.size === 2) {
      const [p1, p2] = [...pointers.values()];
      startDistance = getDistance(p1, p2);
      startScale = scale.value;
      startTranslateX = translateX.value;
      startTranslateY = translateY.value;

      const center = getCenter(p1, p2);
      pinchMidX = center.x;
      pinchMidY = center.y;
    }
  };

  const onPointerMove = e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // 1-Finger Pan
    if (pointers.size === 1) {
      if (scale.value <= 1) return;

      translateX.value = startTranslateX + (e.clientX - dragStartX);
      translateY.value = startTranslateY + (e.clientY - dragStartY);
      return;
    }

    // 2-Finger Pinch Zoom & Pan
    if (pointers.size === 2) {
      const [p1, p2] = [...pointers.values()];
      const currentDistance = getDistance(p1, p2);
      const currentCenter = getCenter(p1, p2);

      if (startDistance === 0) return;

      const pinchRatio = currentDistance / startDistance;
      let newScale = startScale * pinchRatio;

      // Constrain scale with a slight elastic resistance feel out of bounds
      if (newScale < MIN_SCALE) {
        newScale = MIN_SCALE + (newScale - MIN_SCALE) * 0.2;
      } else if (newScale > MAX_SCALE) {
        newScale = MAX_SCALE + (newScale - MAX_SCALE) * 0.2;
      }

      // Android gallery style: zoom into the exact midpoint between the fingers
      const scaleFactor = newScale / startScale;

      translateX.value =
        currentCenter.x -
        pinchMidX +
        startTranslateX * scaleFactor +
        (pinchMidX - getContainerCenterX()) * (1 - scaleFactor);

      translateY.value =
        currentCenter.y -
        pinchMidY +
        startTranslateY * scaleFactor +
        (pinchMidY - getContainerCenterY()) * (1 - scaleFactor);

      scale.value = newScale;
    }
  };

  const onPointerUp = e => {
    pointers.delete(e.pointerId);

    if (pointers.size === 1) {
      // Transition smoothly back to 1-finger panning when lifting one finger
      const remainingPointer = [...pointers.values()][0];
      dragStartX = remainingPointer.x;
      dragStartY = remainingPointer.y;
      startTranslateX = translateX.value;
      startTranslateY = translateY.value;
    }

    // Snap back or snap to bounds when fingers are released
    if (pointers.size === 0) {
      isDragging.value = false; // Re-enable transitions for snap-back

      if (scale.value < MIN_SCALE) {
        reset();
      } else if (scale.value > MAX_SCALE) {
        scale.value = MAX_SCALE;
      }
    }
  };

  const getContainerCenterX = () => {
    if (!container.value) return 0;
    const rect = container.value.getBoundingClientRect();
    return rect.left + rect.width / 2;
  };

  const getContainerCenterY = () => {
    if (!container.value) return 0;
    const rect = container.value.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };

  const reset = () => {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  };
</script>
