import axios from 'axios';
import * as yup from 'yup';
import type { IUploadImageResponse } from './types';

export const getAllPokemon = async () => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=2000`
  );
  return response.data;
};

export const getData = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const apiEndpoint = 'https://api.imgbb.com/1/upload';
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const response = await axios.post(apiEndpoint, formData, {
    params: {
      key: apiKey,
    },
  });
  return response.data as IUploadImageResponse;
};

export const customPokemonSchema = yup.object({
  name: yup
    .string()
    .max(50, 'Maximum amount of characters is 50')
    .required('This input is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  description: yup.string().required('This input is required').max(300),
});

export const createBase64Image = (FileObject: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target) {
        resolve(event.target.result as string);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(FileObject);
  });
};
