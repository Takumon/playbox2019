<template>
  <section class="container">
    <div>
      <table>
        <tr>
          <th>ID</th> 
          <th>名前</th> 
          <th>メール</th> 
          <th>年齢</th>
          <th>-</th>
        </tr>

        <tr v-for="user in users" :key="user.id">
          <template v-if="user.editable">
            <td>{{user.id}}</td>
            <td><input type="text" v-model="user.name"></td>
            <td><input type="email" v-model="user.email"></td>
            <td><input type="number" v-model="user.age"></td>
            <td>
              <button @click="updateUser(user)">編集完了</button>
              <button @click="deleteUser(user.id)">削除</button>
            </td>
          </template>
          <template v-else>
            <td>{{user.id}}</td>
            <td>{{user.name}}</td>
            <td>{{user.email}}</td>
            <td>{{user.age}}</td>
            <td>
              <button @click="chengeEditMode(user)">編集</button>
            </td>
          </template>
        </tr>

        <tr>
          <td></td>
          <td><input type="text" v-model="newUser.name" placeholder="名前"></td>
          <td><input type="email" v-model="newUser.email" placeholder="メール"></td>
          <td><input type="number" v-model="newUser.age" placeholder="年齢"></td>
          <td>
            <button @click="createUser(newUser)">追加</button>
          </td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script>
import getUsersGql from '~/apollo/queries/getUsers.gql'
import createUserGql from '~/apollo/mutations/createUser.gql'
import updateUserGql from '~/apollo/mutations/updateUser.gql'
import deleteUserGql from '~/apollo/mutations/deleteUser.gql'
import userCreatedGql from '~/apollo/subscriptions/userCreated.gql'
import userUpdatedGql from '~/apollo/subscriptions/userUpdated.gql'
import userDeletedGql from '~/apollo/subscriptions/userDeleted.gql'

export default {
  data() {
    return {
      users: [],
      newUser: {
        name: null,
        email: null,
        age: null,
      }
    }
  },
  apollo: {
    users: {
      query: getUsersGql,
      // サーバ側でイベントが発行された時の処理を定義する
      subscribeToMore: [
        {
          // 購読対象のイベント(Subscription)を指定する
          document: userCreatedGql,
          // イベント発行時の処理を記述する
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newUser = subscriptionData.data.userCreated;
            return prev.users.push(newUser);
          }
        },
        {
          // 購読対象のイベント(Subscription)を指定する
          document: userUpdatedGql,
          // イベント発行時の処理を記述する
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const updatedUser = subscriptionData.data.userUpdated;
            const targetUser = prev.users.find(user => user.id == updatedUser.id);
            targetUser.name = updatedUser.name;
            targetUser.email = updatedUser.email;
            targetUser.age = updatedUser.age;

            return prev.users;
          }
        },
        {
          // 購読対象のイベント(Subscription)を指定する
          document: userDeletedGql,
          // イベント発行時の処理を記述する
          updateQuery: (prev, { subscriptionData }) => {
            console.log('fdasfadfadfad')
            if (!subscriptionData.data) {
              return prev;
            }

            const deletedUser = subscriptionData.data.userDeleted;
            const userIndex = prev.users.findIndex(user => user.id == deletedUser.id);

            if (userIndex === -1) throw new Error('User not found');

            prev.users.splice(userIndex, 1);

            return prev.users;
          }
        }
      ]
    }
  },
  methods: {
    async createUser({name, email, age}) {

      const { data, error } = await this.$apollo.mutate({
        mutation: createUserGql,
        variables: {
          name,
          email,
          age,
        },
        // 更新後に、データを再取得したい場合に定義する
        // refetchQueries: [{
        //   query: getUsersGql,
        // }]
      })

      if (error) {
        // TODO エラー処理
        console.log(error);
        return;
      }

      // 入力フォーム初期化
      this.newUser.name = null;
      this.newUser.email = null;
      this.newUser.age = null;
    },
    async updateUser(user) {

      const { data, error } = await this.$apollo.mutate({
        mutation: updateUserGql,
        variables: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
        },
      });

      if (error) {
        // TODO エラー処理
        console.log(error);
        return;
      }

      // 編集を終了
      this.chengeEditMode(user);
    },
    async deleteUser(id) {

      const { data, error } = await this.$apollo.mutate({
        mutation: deleteUserGql,
        variables: {
          id
        },
      })

      if (error) {
        // TODO エラー処理
        console.log(error);
        return;
      }
    },
    chengeEditMode(user) {
      const i = this.users.findIndex(u => u.id == user.id)
      if (i === -1 ) {
        throw new Error('該当するユーザは存在しません');
      }

      this.$set(this.users, i, {
        ...user,
        editable: !user.editable
      });
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

