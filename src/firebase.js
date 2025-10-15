// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Substitua com as suas chaves de configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZCsp-Z_VsEsFA_3JcRC0lyFMSr3ETGUY",
  authDomain: "cm-pacatuba.firebaseapp.com", 
  projectId: "cm-pacatuba",
  databaseURL: "https://cm-pacatuba-default-rtdb.firebaseio.com", 
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que iremos usar
export const auth = getAuth(app);
export const db = getFirestore(app);
// Se for usar Storage:
// export const storage = getStorage(app);

// Exporta o app para uso futuro, se necessário
export default app;