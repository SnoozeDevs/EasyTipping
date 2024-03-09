import firestore from "@react-native-firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";
import auth from "@react-native-firebase/auth";

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
    setRound(res._data.currentRound)
  })
}

export const getFixturesForCurrentRound = async (year: string, currentRound: string, setFixtures: Dispatch<SetStateAction<number>>) => {
  await firestore().collection('standings').doc(`${year}`).collection('rounds').doc(`${currentRound}`).get().then((res: any) => {
    setFixtures(res._data.roundArray)
  })
}

export const updateUserRecord = async (userID: string, randomString: string) => {
  firestore()
    .collection('users')
    .doc(userID)
    .set({
      randomString: randomString
    }, { merge: true }).then(() => {
      console.log('random thing added test')
    })
}

export const getUserDetails = async (userID: string, userData: Dispatch<SetStateAction<any>>) => {
  firestore().collection('users').doc(userID).get().then((res: any) => {
    userData(res._data)
  }).catch((err) => {
    console.error(err)
  })
}

