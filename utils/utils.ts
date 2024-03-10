import firestore from "@react-native-firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";
import auth from "@react-native-firebase/auth";
import uuid from 'react-native-uuid';

export const isEmailValid = (email: string) => {
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return validRegex.test(email)
}

export const getLadder = async (setTeamData: Dispatch<SetStateAction<Array<string>>>, setIsTeamDataLoaded: Dispatch<SetStateAction<boolean>>) => {
  await firestore()
    .collection("standings")
    .doc("2023")
    .get()
    .then((res: any) => {
      setTeamData(res._data.ladder);
      setIsTeamDataLoaded(true);
    });
};

export const signOutUser = () => {
  auth().signOut()
};

export const createUserRecord = (userID: string, displayName: string, email: string) => {
  firestore()
    .collection('users')
    .doc(userID)
    .set({
      userID: userID,
      displayName: displayName,
      email: email,
    }, { merge: true }).then(() => {
      console.log('user added')
    })
}

export const getCurrentRound = async (year: string, setRound: Dispatch<SetStateAction<number>>) => {
  await firestore().collection("standings").doc(`${year}`).get().then((res: any) => {
    setRound(res._data?.currentRound)
  }).catch((err) => {
    console.error(err)
  })
}

export const getFixturesForCurrentRound = async (year: string, currentRound: string, setFixtures: Dispatch<SetStateAction<number>>) => {
  await firestore().collection('standings').doc(`${year}`).collection('rounds').doc(`${currentRound}`).get().then((res: any) => {
    setFixtures(res._data?.roundArray)
  }).catch((err) => {
    console.error(err)
  })
}

export const updateUserRecord = async (userID: string, recordKey: string, recordValue: any) => {
  firestore()
    .collection('users')
    .doc(userID)
    .set({
      [recordKey]: recordValue
    }, { merge: true }).then(() => {
      console.log('Record updated')
    })
}

export const getUserDetails = async (userID: string, userData: Dispatch<SetStateAction<any>>) => {
  firestore().collection('users').doc(userID).get().then((res: any) => {
    userData(res._data)
  }).catch((err) => {
    console.error(err)
  })
}

export const createGroup = async (groupData: any) => {

  const groupId = uuid.v4().toString()

  await firestore()
    .collection('groups').doc(groupId)
    .set({
      groupName: groupData.groupName,
      admin: auth().currentUser?.uid,
      adminName: auth().currentUser?.displayName,
      hasJoker: groupData.hasJokerRound,
      hasPerfectRound: groupData.hasPerfectRound,
      hasFinals: groupData.hasFinals,
    }, { merge: true }).then((res) => {
      console.log('group created', res)
    }).catch((err) => {
      console.error(err);
    })

  await firestore().collection('groups').doc(groupId).collection('users').doc(auth().currentUser?.uid).set({
    isAdmin: true,
    tips: {
      round1: 'Blah'
    }
  }).then((res) => {
    console.log(`user added to group ${groupData.groupName}`, res)
  }).catch((err) => {
    console.error(err);
  })

  await updateUserRecord(auth().currentUser?.uid!, 'groups', {
    groupName: groupData.groupName,
    groupId: groupId,
    isAdmin: true,
  }).then((res) => {
    console.log("Group associated with user record", res);
  }).catch((err) => {
    console.error(err);
  })

}

