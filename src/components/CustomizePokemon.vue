<script setup lang="ts">
import {
  uploadImage,
  customPokemonSchema,
  createBase64Image,
} from '@/config/helpers';
import { ref } from 'vue';
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate';
import { usePokemonStore } from '@/stores/pokemon';
import type { ICustomPokemonEntry, IFormSubmitValues } from '@/config/types';
import Spinner from './icons/Spinner.vue';

const store = usePokemonStore();

const uploadedImage = ref<File | null>();
const imageBase64 = ref('');
const imageErrorMsg = ref('');
const isSubmitLoading = ref<boolean>(false);

const handleFileUpload = async (event: any) => {
  // nisem nasel typescript podpore za upload event
  const file = event.target?.files[0];
  const allowedFileTypes = [
    'image/png',
    'image/svg',
    'image/jpg',
    'image/jpeg',
  ];
  if (!allowedFileTypes.includes(file.type)) {
    console.log('file type not allowed');
    imageErrorMsg.value =
      'Uploaded file type is not allowed. Click to choose again';
    return -1;
  }
  if (file.size > 1024 * 1024) {
    console.log('file too big');
    imageErrorMsg.value =
      'Uploded img is too big (1MB max)! Click to choose again';
    return -1;
  } // ce je datoteka vecja kot 1MB, se nastavi error msg na file is too big

  uploadedImage.value = file;
  imageErrorMsg.value !== '' ? (imageErrorMsg.value = '') : 0;
  imageBase64.value = await createBase64Image(file);
};

const handleFormSubmit = async (values: any, { resetForm }: any) => {
  try {
    if (uploadedImage.value) {
      isSubmitLoading.value = true; // naredi loading
      const response = await uploadImage(uploadedImage.value);
      isSubmitLoading.value = false; // po tem ko se konca se loader konca
      imageErrorMsg.value !== '' ? (imageErrorMsg.value = '') : 0; // ce me kaksen error, ki se obstaja ga tukaj zbrisemo, saj je vse slo skozi
      uploadedImage.value = null;
      imageBase64.value = '';
      const customPokemon: ICustomPokemonEntry = {
        name: values.name,
        description: values.description,
        url: response.display_url,
      };
      console.log(response);
      store.editActivePokemon(customPokemon);
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
  <section class="mt-10" v-if="store.activePokemon">
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
