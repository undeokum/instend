import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBcfUjs6ccHKHpWEMGFZnmCzrk0xQOqnK4',
  authDomain: 'instend-b2a8d.firebaseapp.com',
  projectId: 'instend-b2a8d',
  storageBucket: 'instend-b2a8d.appspot.com',
  messagingSenderId: '734650930077',
  appId: '1:734650930077:web:408a2e76eb5a53da435574',
  measurementId: 'G-3M7TK4DR4K'
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)