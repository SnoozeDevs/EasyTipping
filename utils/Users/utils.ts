import firestore, { FirebaseFirestoreTypes, firebase } from "@react-native-firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";
import auth from "@react-native-firebase/auth";
import uuid from 'react-native-uuid';
import { router } from "expo-router";
import { TUserRecord } from "../types";
import { destructureGroupData } from "../Groups/utils";


export const createUserRecord = async (userID: string, displayName: string, email: string) => {
  await firestore()
    .collection('users')
    .doc(userID)
    .set({
      userID: userID,
      displayName: displayName,
      email: email,
      groups: [],
    }, { merge: true }).then(() => {
      console.log('user added')
    }).catch((err) => {
      console.error(err)
    })
}

export const updateUserRecord = async (userID: string, recordKey: string, recordValue: any, isArray: boolean) => {
  firestore()
    .collection('users')
    .doc(userID)
    .set({
      [recordKey]: isArray ? firestore.FieldValue.arrayUnion(recordValue) : recordValue
    }, { merge: true }).then(() => {
      console.log('Record updated')
    })
}

export const getUserDetails = async (userID: string, user: TUserRecord, userSetter: Dispatch<SetStateAction<any>>) => {
  const userPath = firestore().collection('users').doc(userID);
  let userEmail, userDisplayName, userId, selectedLeague;

  //* Adds all of the base level document data
  await userPath.get().then((res: any) => {
    if (res.exists) {
      userEmail = res.data().email,
        userDisplayName = res.data().displayName,
        userId = res.data().userID
      selectedLeague = res.data().selectedLeague
    }
  }).catch((err) => {
    console.error(err)
  })
  const groupObject = await destructureGroupData();

  //* at end of process when all data is fetched, set total user in one hit
  userSetter({
    ...(user as TUserRecord),
    email: userEmail,
    displayName: userDisplayName,
    userID: userId,
    selectedLeague: selectedLeague,
    groups: groupObject
  })
}
