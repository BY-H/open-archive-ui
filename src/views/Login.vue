<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">系统登录</h2>
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          label="用户"
          placeholder="请输入用户名"
          label-width="60"
        />
        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          label-width="60"
        />
        <div class="button-area">
          <van-button round block type="primary" native-type="submit">登 录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/users'
import { showToast } from 'vant'   // ← Vant4 正确用法

const router = useRouter()
const username = ref('')
const password = ref('')

const onSubmit = async () => {
  if (!username.value || !password.value) {
    return showToast({ type: 'fail', message: "请输入用户名和密码" })
  }

  try {
    const res = await login({
      username: username.value,
      password: password.value
    })

    const token = res.token
    if (!token) {
      return showToast({ type: 'fail', message: "后端未返回 token" })
    }

    localStorage.setItem('token', token)
    localStorage.setItem('role', res.role)

    showToast("登录成功")   // ← 正确弹窗

    setTimeout(() => {
      router.push('/query')
    }, 500)

  } catch (err) {
    console.error(err)
    showToast({ type: 'fail', message: "登录失败，请检查用户名或密码" })
  }
}
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f6fa;
  padding: 0 16px;
  box-sizing: border-box;
}

.login-box {
  width: 95%;
  max-width: 480px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 40px 30px;
}

.title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 30px;
  font-weight: 700;
  color: #222;
}

.van-field {
  font-size: 20px; /* 输入框文字 */
  margin-bottom: 22px;
}

.van-cell__title {
  font-size: 20px !important; /* 左侧label更大 */
}

.van-cell__value input {
  font-size: 20px !important; /* 输入内容更大 */
}

.van-button {
  font-size: 20px;
  height: 56px;
  border-radius: 28px;
}

.button-area {
  margin-top: 32px;
}
</style>
