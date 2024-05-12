import firestore, { FirebaseFirestoreTypes, firebase } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import uuid from 'react-native-uuid';
import { router } from "expo-router";
import { Dispatch, SetStateAction } from "react";

export const createGroup = async (groupData: any, isLoading: Dispatch<SetStateAction<boolean>>, sportsLeague: string) => {
  isLoading(true)
  const groupId = uuid.v4().toString()
  const userRef = firestore().collection('users').doc(auth().currentUser?.uid)
  const groupRef = firestore().collection('groups').doc(groupId)

  //* Creates initial group record
  await groupRef
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
  await groupRef.collection('users').doc(auth().currentUser?.uid).set({
    name: auth().currentUser?.displayName,
    isAdmin: true,
  }).then((res) => {
    console.log(`user added to group ${groupData.groupName}`, res)
  }).catch((err) => {
    console.error(err);
    return
  })

  //* Adds the user to leaderboard with scores of 0.
  //todo build in average score assigned by default
  await groupRef.collection('leaderboard').doc(auth().currentUser?.uid).set({
    name: auth().currentUser?.displayName,
    totalPoints: 0,
    margin: 0
  }, { merge: true })

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
  //* When joining a group, the sharer link HAS to be the in the format '{groupId}?{league}' eg: a2fs32cbb8?afl
  //* Need to run cron job of assigning them the default tips for all games until the current game.
  isLoading(true)
  const groupId = groupLink.split('?')[0]
  const sportsLeague = groupLink.split('?')[1]
  const groupRef = firestore().collection('groups').doc(groupId)
  const userGroupRef = groupRef.collection('users').doc(auth().currentUser?.uid)
  const userRecordRef = firestore().collection('users').doc(auth().currentUser?.uid)

  const addNewUser = async () => {

    let groupResponseData: any = {};

    await groupRef.get().then((res) => {
      groupResponseData = res.data()!
    }).catch((err) => {
      console.log(err)
      return
    })

    const groupData = {
      groupId: groupId,
      groupName: groupResponseData.groupName,
      isAdmin: auth().currentUser?.uid === groupResponseData.admin,
      league: sportsLeague,
    }

    //* Add user to group
    await userGroupRef.set({
      name: auth().currentUser?.displayName,
      isAdmin: false,
    }).catch((err) => {
      console.error(err);
      return
    })

    //*Add user to leaderboard and give them a score of 0
    //todo build in average score assigned by default
    await groupRef.collection('leaderboard').doc(auth().currentUser?.uid).set({
      name: auth().currentUser?.displayName,
      totalPoints: 0,
      margin: 0
    }, { merge: true })


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

  await userGroupRef.get().then(async (res) => {
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

export const destructureGroupData = async () => {
  const userDocRef = firestore().collection("users").doc(auth().currentUser?.uid!);
  const userGroupsCollectionRef = userDocRef.collection("groups")
  const groupSnapshots = await userGroupsCollectionRef.get();
  let groupObject = {}

  for (const groupDoc of groupSnapshots.docs) {
    const tipCollectionRef = userGroupsCollectionRef.doc(groupDoc.id).collection('tips');
    const resultsCollectionRef = userGroupsCollectionRef.doc(groupDoc.id).collection('results');
    const tipSnapshots = await tipCollectionRef.get();
    const resultSnapshots = await resultsCollectionRef.get()
    const userRank = await getUserGroupRanking(groupDoc.id, auth().currentUser?.uid!)
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
        currentRank: userRank
      }
    }
  }

  return groupObject
};


export const getUserGroupRanking = async (groupId: string, userId: string) => {
  const leaderboardCollection = await firestore().collection('groups').doc(groupId).collection('leaderboard').get()
  const scoreArray: any[] = []

  leaderboardCollection.forEach((user) => {
    scoreArray.push({
      id: user.id,
      score: user.data().totalPoints
    })
  })

  const sortedArray = scoreArray.sort((a, b) => { return b.totalPoints - a.totalPoints })
  return sortedArray.findIndex(user => user.id === userId)

}

export const getTotalUsersInGroup = async (groupId: string, setTotalUsers: Dispatch<SetStateAction<number>>) => {
  const userCountRef = await firestore().collection('groups').doc(groupId).collection('users').count().get()
  setTotalUsers(userCountRef.data().count);
}


export const getGroupData = async (groupId: string, setGroupData?: Dispatch<SetStateAction<any>>) => {

  const groupRef = firestore().collection('groups').doc(groupId)
  const leaderboardCollection = await groupRef.collection('leaderboard').get()
  const scoreArray: any[] = []
  leaderboardCollection.forEach((user) => {
    scoreArray.push({
      id: user.id,
      score: user.data().totalPoints,
      name: user.data().name
    })
  })

  const sortedArray = scoreArray.sort((a, b) => { return b.totalPoints - a.totalPoints })

  setGroupData && setGroupData(sortedArray)
  return sortedArray
}

