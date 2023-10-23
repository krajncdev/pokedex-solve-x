<script setup lang="ts">
import {
  uploadImage,
  customPokemonSchema,
  createBase64Image,
} from '@/config/helpers';
import { ref } from 'vue';
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate';
import { usePokemonStore } from '@/stores/pokemon';
import type { ICustomPokemon } from '@/config/types';
import Spinner from './icons/Spinner.vue';

const store = usePokemonStore();

const uploadedImage = ref<File | null>();
const imageBase64 = ref('');
const imageErrorMsg = ref('');
const isSubmitLoading = ref<boolean>(false);

const handleFileUpload = async (event: any) => {
  // nisem nasel typescript podpore za upload event
  uploadedImage.value = event?.target?.files[0];
  if (uploadedImage.value && uploadedImage.value.size > 1024 * 1024) {
    console.log('file too big');
    imageErrorMsg.value =
      'Uploded img is too big (1MB max)! Click to choose again';
    return -1;
  } // ce je datoteka vecja kot 1MB, se nastavi error msg na file is too big
  imageErrorMsg.value !== '' ? (imageErrorMsg.value = '') : 0;
  imageBase64.value = await createBase64Image(event.target?.files[0]);
};

const handleFormSubmit = async (values: any, { resetForm }: any) => {
  try {
    if (uploadedImage.value) {
      isSubmitLoading.value = true;
      const response = await uploadImage(uploadedImage.value);
      isSubmitLoading.value = false;
      const customPokemon: ICustomPokemon = {
        ...values,
        response,
      };
      store.addCustomPokemon(customPokemon);

      imageErrorMsg.value !== '' ? (imageErrorMsg.value = '') : 0; // ce me kaksen error, ki se obstaja ga tukaj zbrisemo, saj je vse slo skozi
      uploadedImage.value = null;
      imageBase64.value = '';
      resetForm();
    } else {
      imageErrorMsg.value =
        'You must choose an image to continue! Click to choose an image.';
    }
  } catch (err) {
    console.error('Error', err);
  }
};
</script>

<template>
  <section class="mt-10">
    <h2 class="text-2xl font-semibold">Customize the POKEMON</h2>
    <div class="grid grid-cols-2 gap-10 mt-8">
      <div class="flex justify-center ml-20">
        <input
          type="file"
          @change="handleFileUpload"
          accept="image/png,image/svg,image/jpeg,image/jpg"
          id="imageUpload"
          class="opacity-0 h-0 w-0"
        />
        <label
          for="imageUpload"
          class="cursor-pointer hover:bg-orange/20 border-2 border-black rounded-full w-64 h-64 p-4 flex justify-center items-center"
        >
          <img
            v-if="imageBase64 && imageErrorMsg === ''"
            :src="imageBase64"
            alt="uploadedimg"
            class="p-4"
          />
          <p v-if="!imageBase64 && imageErrorMsg === ''" class="text-center">
            Click to upload image of your pokemon
          </p>
          <p v-if="imageErrorMsg" class="text-orange">
            {{ imageErrorMsg }}
          </p>
        </label>
      </div>
      <div>
        <VeeForm
          v-slot="{ handleSubmit }"
          as="div"
          :validation-schema="customPokemonSchema"
        >
          <form
            class="flex flex-col gap-2"
            @submit="
              {
                handleSubmit($event, handleFormSubmit);
              }
            "
          >
            <Field
              name="name"
              class="border-2 border-black border-solid rounded-md px-2 py-1.5 outline-none"
              placeholder="Your custom name of the pokemon"
            />
            <ErrorMessage name="name" class="text-orange" />
            <Field
              name="description"
              as="textarea"
              class="border-2 border-black border-solid rounded-md px-2 py-1.5 outline-none resize-none h-32"
              placeholder="Your custom description of the pokemon"
            />
            <ErrorMessage name="description" class="text-orange" />
            <div class="self-end flex items-center">
              <div v-if="isSubmitLoading">
                <Spinner />
              </div>
              <button
                class="border-2 border-black border-solid rounded-md px-4 py-1.5 w-fit"
              >
                Save
              </button>
            </div>
          </form>
        </VeeForm>
      </div>
    </div>
  </section>
</template>
