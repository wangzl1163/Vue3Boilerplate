<template>
	<el-form ref="form" :model="user" :rules="rules" label-width="80px">
		<el-form-item label="旧密码" prop="password">
			<el-input v-model="user.password" placeholder="请输入旧密码" type="password" />
		</el-form-item>
		<el-form-item label="新密码" prop="modify_password">
			<el-input v-model="user.modify_password" placeholder="请输入新密码" type="password" />
		</el-form-item>
		<!-- <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" />
    </el-form-item> -->
		<el-form-item>
			<el-button type="primary" size="mini" @click="submit">保存</el-button>
			<el-button type="danger" size="mini" @click="close">关闭</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import { updateUserPwd } from '@/Apis/User'

export default {
	data() {
		const equalToPassword = (rule, value, callback) => {
			if (this.user.newPassword !== value) {
				callback(new Error('两次输入的密码不一致'))
			} else {
				callback()
			}
		}

		return {
			test: '1test',
			user: {
				username: '',
				password: '',
				modify_password: '',
				confirmPassword: undefined
			},
			// 表单校验
			rules: {
				oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
				newPassword: [
					{ required: true, message: '新密码不能为空', trigger: 'blur' },
					{ min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
				],
				confirmPassword: [
					{ required: true, message: '确认密码不能为空', trigger: 'blur' },
					{ required: true, validator: equalToPassword, trigger: 'blur' }
				]
			}
		}
   },
   computed: {
      userName() {
         return this.$store.state.user.name === 'admin' ? this.$store.state.user.name : this.$store.state.user.userInfo.user_name
      }
   },
	methods: {
		submit() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					updateUserPwd({
						...this.user,
						username: this.userName
					}).then(() => {
						this.$message.success('修改成功')
					})
				}
			})
		},
		close() {
			this.$store.dispatch('delView', this.$route)
			this.$router.push({ path: '/index' })
		}
	}
}
</script>
