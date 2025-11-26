<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">用户注册</h2>

      <van-form @submit="onSubmit">
        <!-- 用户名 -->
        <van-field
          v-model="username"
          label="用户"
          placeholder="请输入用户名"
          label-width="60"
        />

        <!-- 密码 -->
        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          label-width="60"
        />

        <!-- 邀请码，可为空（为空则普通用户） -->
        <van-field
          v-model="inviteCode"
          label="邀请码"
          placeholder="如需注册管理员，请输入邀请码"
          label-width="60"
        />

        <div class="button-area">
          <van-button round block type="primary" native-type="submit">
            注 册
          </van-button>
        </div>

        <div class="link-area">
          <span @click="goLogin">已有账号？去登录</span>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import { register } from '@/api/users'

const username = ref('')
const password = ref('')
const inviteCode = ref('')

const router = useRouter()

const onSubmit = async () => {
  if (!username.value || !password.value) {
    return showToast({ type: 'fail', message: '请输入用户名和密码' })
  }

  try {
    const res = await register({
      username: username.value,
      password: password.value,
      invite_code: inviteCode.value
    })

    showToast('注册成功')

    setTimeout(() => {
      router.push('/login')
    }, 600)
  } catch (err) {
    showToast({ type: 'fail', message: err.message || '注册失败' })
  }
}

const goLogin = () => router.push('/login')
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
  font-size: 20px;
  margin-bottom: 22px;
}

.van-cell__title {
  font-size: 20px !important;
}

.van-cell__value input {
  font-size: 20px !important;
}

.van-button {
  font-size: 20px;
  height: 56px;
  border-radius: 28px;
}

.button-area {
  margin-top: 32px;
}

.link-area {
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
  color: #666;
}

.link-area span {
  color: #1989fa;
}
</style>
