import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
	apiKey: "AIzaSyDuxdtjTAFa1cmCDv7E1KaD7ABa5tvYkLQ",
	authDomain: "superchat-f3a03.firebaseapp.com",
	projectId: "superchat-f3a03",
	storageBucket: "superchat-f3a03.appspot.com",
	messagingSenderId: "590855585838",
	appId: "1:590855585838:web:e5f42160040505ccf19fbf",
	measurementId: "G-1V66E9TD7S"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
	const [user] = useAuthState(auth);

	return (
		<div className="App">
			<header className="App-header">

			</header>

			<section>
				{user ? <ChatRoom /> : <SignIn />}
			</section>
		</div>
	);
}

function SignIn() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	}

	return (
		<button onClick={signInWithGoogle}>Sign In with Google</button>
	)
}

function SignOut() {
	return auth.currentUser && (
		<button onClick={() => auth.signOut()}>Sign Out</button>
	)
}

function ChatRoom() {

	const dummy = useRef();

	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit(25);

	const [messages] = useCollectionData(query, {idField: 'id'});

	const [formValue, setFromValue] = useState('');

	const sendMessage = async(e) => {
		e.preventDefault();

		const { uid, photoURL} = auth.currentUser;
		await messagesRef.add({
			text: formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid, 
			photoURL
		});

		setFromValue('');

		dummy.current.scrollIntoView({behavior: 'smooth'});
	}

	return (
		<div>
			<div>
				{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

				<span ref={dummy}></span>
			</div>

			<form onSubmit={sendMessage}>

				<input value={formValue} onChange={(e) => setFromValue(e.target.value)} />
				<button type='submit'>Send</button>
			</form>
		</div>
	)
}

function ChatMessage(props) {
	const {text, uid, photoURL} = props.message;

	const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

	return (
		<div className={`message ${messageClass}`}>
			<img src={photoURL} />
			<p>
				{text}
			</p>
		</div>
	)
}

export default App;
