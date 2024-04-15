import firestore, { FirebaseFirestoreTypes, firebase } from "@react-native-firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";
import auth from "@react-native-firebase/auth";
import uuid from 'react-native-uuid';
import { router } from "expo-router";
import { TUserRecord } from "./types";

export const isEmailValid = (email: string) => {
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return validRegex.test(email)
}

//! Deprecated --- needs to be updated
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

export const getCurrentRound = async (year: string, setRound: Dispatch<SetStateAction<number>>) => {
  await firestore().collection("standings").doc(`${year}`).get().then((res: any) => {
    setRound(res._data?.currentRound)
  }).catch((err) => {
    console.error(err)
  })
}

export const getFixturesForCurrentRound = async (year: string, currentRound: string, setFixtures: Dispatch<SetStateAction<number>>, setFixturesLoading: Dispatch<SetStateAction<boolean>>, setFixtureLength: Dispatch<SetStateAction<number>>) => {
  setFixturesLoading(true)
  // console.log('server', firebase.firestore.Timestamp.now());

  await firestore().collection('standings').doc(`${year}`).collection('rounds').doc(`${currentRound}`).get().then((res: any) => {
    const timeSortedFixtures = res.data().roundArray.sort((a: any, b: any) => a.unixtime - b.unixtime);
    const fixtureArray = (matches: any) => {
      return matches.map((match: any) => {
        const matchStarted = firebase.firestore.Timestamp.now() > match.unixtime
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

  //* at end of process when all data is fetched, set total user in one hit
  userSetter({
    ...(user as TUserRecord),
    email: userEmail,
    displayName: userDisplayName,
    userID: userId,
    selectedLeague: selectedLeague,
  })
}

export const getCollectionData = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => {
  const groupArray: any = [];
  querySnapshot.forEach((record) => {
    groupArray.push(record.data());
  });

  return groupArray;
}

export const createGroup = async (groupData: any, isLoading: Dispatch<SetStateAction<boolean>>, sportsLeague: string) => {
  isLoading(true)
  const groupId = uuid.v4().toString()
  const userRef = firestore().collection('users').doc(auth().currentUser?.uid)

  //* Creates initial group record
  await firestore()
    .collection('groups').doc(groupId)
    .set({
      groupName: groupData.groupName,
      admin: auth().currentUser?.uid,
      adminName: auth().currentUser?.displayName,
      hasJoker: groupData.hasJokerRound,
      hasPerfectRound: groupData.hasPerfectRound,
      hasFinals: groupData.hasFinals,
      league: sportsLeague,
    }, { merge: true }).then((res) => {
      console.log('group created', res)
    }).catch((err) => {
      console.error(err);
      return
    })

  //* Adds the user who created it an makes them an admin
  await firestore().collection('groups').doc(groupId).collection('users').doc(auth().currentUser?.uid).set({
    name: auth().currentUser?.displayName,
    isAdmin: true,
  }).then((res) => {
    console.log(`user added to group ${groupData.groupName}`, res)
  }).catch((err) => {
    console.error(err);
    return
  })

  const groupObject = {
    groupName: groupData.groupName,
    groupId: groupId,
    isAdmin: true,
    league: sportsLeague,
  }

  //* Adds the league the user has selected as their default league selection
  await userRef.update({
    selectedLeague: sportsLeague
  })

  //* Associates the newly created group in the users collection to serve on user powered pages (eg tips).
  await userRef.collection('groups').doc(groupId).set(groupObject, { merge: true }).then((res) => {
    console.log('Group successfully associated with user record!')
  }).catch((err) => {
    console.error(err)
  })

  //TODO send group id as param to automatically select that tip
  //TODO when navigating back to tip screen
  router.navigate('tip')
  isLoading(false)
}

export const joinGroup = async (groupLink: string, isLoading: Dispatch<SetStateAction<boolean>>) => {
  isLoading(true)
  const groupId = groupLink.split('?')[0]
  const sportsLeague = groupLink.split('?')[1]

  const groupRef = firestore().collection('groups').doc(groupId)
  const usersRef = groupRef.collection('users').doc(auth().currentUser?.uid)
  const userRecordRef = firestore().collection('users').doc(auth().currentUser?.uid)

  const addNewUser = async () => {

    let groupResponseData: any = {};

    await groupRef.get().then((res) => {
      groupResponseData = res.data()!
    }).catch((err) => {
      console.log(err)
      return
    })

    //* Add user to group
    await usersRef.set({
      name: auth().currentUser?.displayName,
      isAdmin: false,
    }).catch((err) => {
      console.error(err);
      return
    })

    const groupData = {
      groupId: groupId,
      groupName: groupResponseData.groupName,
      isAdmin: auth().currentUser?.uid === groupResponseData.admin
    }

    await userRecordRef.update({
      selectedLeague: sportsLeague
    })

    //* Associate group into user document
    await userRecordRef.collection('groups').doc(groupId).set(groupData, { merge: true }).then((res) => {
      console.log('Group successfully associated with user record!')
    }).catch((err) => {
      console.error(err)
    })
  }

  await usersRef.get().then(async (res) => {
    if (res.exists) {
      console.error('User is already part of group')
    } else {
      await addNewUser()
    }
  }).catch((err) => {
    console.error(err)
    isLoading(false)
  })

  router.navigate('tip')
  isLoading(false)
}

export const getGroups = (userId: string, userGroups: Dispatch<SetStateAction<any>>) => {
  firestore().collection('users').doc(userId).get().then((res: any) => {
    userGroups(res._data.groups)
  }).catch((err) => {
    console.error(err)
  })
}

export const abbreviateTeam = (teamName: string) => {

  switch (teamName) {
    case 'Richmond':
      return 'RIC'
    case 'Carlton':
      return 'CAR'
    case 'Sydney':
      return 'SYD'
    case 'Collingwood':
      return 'COL'
    case 'Hawthorn':
      return 'HAW'
    case 'Essendon':
      return 'ESS'
    case 'Brisbane Lions':
      return 'BRI'
    case 'Fremantle':
      return 'FRE'
    case 'St Kilda':
      return 'STK'
    case 'Geelong':
      return 'GEL'
    case 'Adelaide':
      return 'ADE'
    case 'Gold Coast':
      return 'GCS'
    case 'North Melbourne':
      return 'NOR'
    case 'Greater Western Sydney':
      return 'GWS'
    case 'Western Bulldogs':
      return 'WBD'
    case 'Melbourne':
      return 'MEL'
    case 'West Coast':
      return 'WCE'
    case 'Port Adelaide':
      return 'POR'

  }
}

export const convertUnixToLocalTime = (unixTimeCode: number) => {
  //* Keep these incase we need UTC test comparisons
  // const formattedUTCTime = date.toUTCString();
  // const formattedLocalTime = date.toLocaleString();

  const date = new Date(unixTimeCode * 1000);

  const displayOptions: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };


  const formattedLocalTime = date.toLocaleString('en-AU', displayOptions);
  const splitData = formattedLocalTime.replace(" at ", ",").split(',');

  return {
    matchDay: splitData[0],
    matchDate: splitData[1],
    matchTime: splitData[2],
  }
}

export const ImageFetch: any = {
  CAR: require('../assets/images/CARL.png'),
  RIC: require('../assets/images/RICH.png'),
  COL: require('../assets/images/COLL.png'),
  SYD: require('../assets/images/SYD.png'),
  ESS: require('../assets/images/ESS.png'),
  HAW: require('../assets/images/HAW.png'),
  GWS: require('../assets/images/GWS.png'),
  NOR: require('../assets/images/NMFC.png'),
  GEL: require('../assets/images/GEEL.png'),
  STK: require('../assets/images/STK.png'),
  GCS: require('../assets/images/GCFC.png'),
  ADE: require('../assets/images/ADEL.png'),
  MEL: require('../assets/images/MELB.png'),
  WBD: require('../assets/images/WB.png'),
  POR: require('../assets/images/PORT.png'),
  WCE: require('../assets/images/WCE.png'),
  FRE: require('../assets/images/FRE.png'),
  BRI: require('../assets/images/BL.png')
}

export const uploadTips = async (selectedGroup: string, round: string, tips: any, tipsLoading: Dispatch<SetStateAction<boolean>>) => {
  //TODO update user record to reflect the tips for that round
  tipsLoading(true)
  const groupTipRef = firestore().collection('users').doc(auth().currentUser?.uid).collection('groups').doc(`${selectedGroup}`).collection('tips').doc(`${round}`)
  groupTipRef.set(tips, { merge: true }).then(() => {
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

export const destructureGroupData = async () => {
  const userDocRef = firestore().collection("users").doc(auth().currentUser?.uid!);
  const userGroupsCollectionRef = userDocRef.collection("groups")
  const groupArray: any = []
  const groupSnapshots = await userGroupsCollectionRef.get();
  let groupObject = {}

  for (const groupDoc of groupSnapshots.docs) {
    const tipCollectionRef = userGroupsCollectionRef.doc(groupDoc.id).collection('tips');
    const resultsCollectionRef = userGroupsCollectionRef.doc(groupDoc.id).collection('results');
    const tipSnapshots = await tipCollectionRef.get();
    const resultSnapshots = await resultsCollectionRef.get()
    const tipObject: any = {}
    const resultsObject: any = {}

    resultSnapshots.forEach((doc) => {
      resultsObject[doc.id] = doc.data()
    });

    tipSnapshots.forEach((doc) => {
      tipObject[doc.id] = doc.data()
    });

    groupObject = {
      ...groupObject,
      [groupDoc.data().groupId]: {
        ...groupDoc.data(),
        tips: tipObject,
        results: resultsObject,
      }
    }
  }

  console.log('group obj ', groupObject)
  return groupObject
};
