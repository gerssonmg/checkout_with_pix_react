import { getDatabase, ref, set } from "firebase/database";

import { onValue } from "firebase/database";

export function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  console.log(db)
  set(ref(db, 'users/' + 'userId'), {
    username: 'name',
    email: 'email',
    profile_picture: 'imageUrl'
  });
  // set(ref(db, 'users/' + userId), {
  //   username: name,
  //   email: email,
  //   profile_picture: imageUrl
  // });
}

export function readUserData() {

  const db = getDatabase();
  const starCountRef = ref(db, 'users/' + 'userId');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data)
  });

}