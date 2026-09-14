<template>
  <div class="overflow-hidden aspect-square rounded object-cover">
    <Loading v-if="!imageUrl" />
    <img v-else :src="imageUrl" class="fscreen object-cover" />
  </div>
</template>

<script setup>
  import Loading from "@/components/Loading.vue";
  import { ref, onBeforeMount, onUnmounted } from "vue";

  import { fs } from "@/api";

  const props = defineProps({
    path: {
      type: String,
      required: true
    }
  });

  const imageUrl = ref("");

  onBeforeMount(async () => {
    const { error, data } = await fs.thumbnail(props.path);

    if (error) {
      console.error(error);
    }

    imageUrl.value = URL.createObjectURL(data);
  });

  onUnmounted(() => {
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
    }
  });
</script>
