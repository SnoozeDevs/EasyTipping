import firestore, { firebase } from "@react-native-firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";
import auth from "@react-native-firebase/auth";


export const getCurrentRound = async (year: string, setRound: Dispatch<SetStateAction<number>>) => {
  await firestore().collection("standings").doc(`${year}`).get().then((res: any) => {
    setRound(res._data?.currentRound)
  }).catch((err) => {
    console.error(err)
  })
}

export const getFixturesForCurrentRound = async (year: string, currentRound: string, setFixtures: Dispatch<SetStateAction<number>>, setFixturesLoading: Dispatch<SetStateAction<boolean>>, setFixtureLength: Dispatch<SetStateAction<number>>) => {
  setFixturesLoading(true)

  await firestore().collection('standings').doc(`${year}`).collection('rounds').doc(`${currentRound}`).get().then((res: any) => {
    const timeSortedFixtures = res.data().roundArray.sort((a: any, b: any) => a.unixtime - b.unixtime);
    const fixtureArray = (matches: any) => {
      return matches.map((match: any) => {
        const matchStarted = firebase.firestore.Timestamp.now().seconds > match.unixtime
        return {
          ...match,
          matchStarted: matchStarted
        }
      })
    }
    setFixtureLength(res.data().roundArray.length);
    setFixtures(fixtureArray(timeSortedFixtures))
    setFixturesLoading(false)
  }).catch((err) => {
    console.error(err)
  })
}

export const uploadTips = async (selectedGroup: string, round: string, tips: any, tipsLoading: Dispatch<SetStateAction<boolean>>, margin: number) => {
  //TODO update user record to reflect the tips for that round
  tipsLoading(true)
  const tipObject = margin > -1 ? {
    ...tips,
    margin: margin
  } : tips
  const groupTipRef = firestore().collection('users').doc(auth().currentUser?.uid).collection('groups').doc(`${selectedGroup}`).collection('tips').doc(`${round}`)
  groupTipRef.set(tipObject, { merge: true }).then(() => {
    console.log('Tips added to user group')
    tipsLoading(false)
  }).catch(() => {
    tipsLoading(false)
    console.error('Error adding tips')
  })

  //TODO - once the game is over, update the record in the user AND the selcted group
  //todo to update scoring and group data
  //! This part will have to be done in the functions
}
