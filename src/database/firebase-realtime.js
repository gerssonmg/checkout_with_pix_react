import { getDatabase, ref, set } from "firebase/database";

import { onValue } from "firebase/database";

export function readUserData() {

  const db = getDatabase();
  const starCountRef = ref(db, 'users/' + 'userId');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
  });

}