<template>
	<div class="login-wrapper" id="loginBackground">
		<div class="form-wrapper">
			<h1 class="login-title">登录</h1>
			<p class="login-system">{{ $config.siteName }}</p>
			<!-- 登录表单 -->
			<el-form
				class="login-form"
				ref="loginForm"
				:model="loginForm"
				:rules="loginFormRules"
				label-width="100px"
				hide-required-asterisk
			>
				<el-form-item prop="phone">
					<el-input
						prefix-icon="el-icon-mobile-phone"
						v-model="loginForm.phone"
						placeholder="手机号"
					></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
						prefix-icon="el-icon-lock"
						v-model="loginForm.password"
						placeholder="密码"
						show-password
					></el-input>
				</el-form-item>
				<!-- 页面宽度大于 768 像素时，直接在表单项内显示滑动解锁 -->
<!--				<el-form-item v-if="screenWidth > 768">-->
<!--					<drag-verify-->
<!--						ref="dragVerifyRef"-->
<!--						text="请按住滑块拖动解锁"-->
<!--						successText="验证通过"-->
<!--						handlerIcon="el-icon-d-arrow-right"-->
<!--						successIcon="el-icon-circle-check"-->
<!--						handlerBg="#F5F7FA"-->
<!--						:width="375"-->
<!--						:isPassing.sync="isPassing"-->
<!--						@update:isPassing="updateIsPassing"-->
<!--					></drag-verify>-->
<!--				</el-form-item>-->
				<el-form-item class="login-btn-form-item">
					<el-button
						class="login-btn"
						type="primary"
						:loading="loginBtnLoading"
						@click="submitForm('loginForm')"
						>登录</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<!-- 页面宽度小于等于 768 像素时，在遮罩层内显示滑动解锁，以防止移动端浏览器自带的左滑返回上一页手势 -->
<!--		<div-->
<!--			class="drag-verify-modal"-->
<!--			v-show="isShowDragVerify"-->
<!--			v-if="screenWidth <= 768"-->
<!--			@click.self="isShowDragVerify = false"-->
<!--		>-->
<!--&lt;!&ndash;			<drag-verify&ndash;&gt;-->
<!--&lt;!&ndash;				ref="dragVerifyRef"&ndash;&gt;-->
<!--&lt;!&ndash;				text="请按住滑块拖动解锁"&ndash;&gt;-->
<!--&lt;!&ndash;				successText="验证通过"&ndash;&gt;-->
<!--&lt;!&ndash;				handlerIcon="el-icon-d-arrow-right"&ndash;&gt;-->
<!--&lt;!&ndash;				successIcon="el-icon-circle-check"&ndash;&gt;-->
<!--&lt;!&ndash;				handlerBg="#F5F7FA"&ndash;&gt;-->
<!--&lt;!&ndash;				:width="300"&ndash;&gt;-->
<!--&lt;!&ndash;				:isPassing.sync="isPassing"&ndash;&gt;-->
<!--&lt;!&ndash;				@update:isPassing="updateIsPassing"&ndash;&gt;-->
<!--&lt;!&ndash;			></drag-verify>&ndash;&gt;-->
<!--		</div>-->
	</div>
</template>

<script>
import CanvasNest from 'canvas-nest.js'
// import DragVerify from '_c/common/DragVerify.vue' //  引入滑动解锁组件
import { login } from '_r/user.js'

// 配置
const config = {
	color: '64, 158, 255', // 线条颜色
	pointColor: '64, 158, 255', // 节点颜色
	opacity: 0.5, // 线条透明度
	count: 99, // 线条数量
	zIndex: -1 // 画面层级
}

export default {
	name: 'Login',
	components: { },
	data() {
		return {
			// 登录表单数据
			loginForm: {
				phone: '',
				password: ''
			},
			// 登录表单验证规则
			loginFormRules: {
				phone: [
					{ required: true, message: '请输入手机号', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{
						min: 5,
						max: 20,
						message: '长度在 5 到 20 个字符',
						trigger: 'blur'
					}
				]
			},
			// isShowDragVerify: false, //  页面宽度小于 768px 时，滑动解锁是否显示
			isPassing: true, //  滑动解锁是否验证通过
			// loginBtnDisabled: true, //  登录按钮是否禁用
			loginBtnLoading: false //  登录按钮是否 loading 状态
		}
	},
	computed: {
		url() {
			let _url = this.$route.query.Rurl //  获取路由前置守卫中 next 函数的参数，即登录后要去的页面
			return _url
				? { path: _url }
				: { name: 'File', query: { fileType: 0, filePath: '/' } } //  若登录之前有页面，则登录后仍然进入该页面
		},
		// 屏幕宽度
		screenWidth() {
			return this.$store.state.common.screenWidth
		}
	},
	// watch: {
	// 	//  滑动解锁验证通过时，若重新输入用户名或密码，滑动解锁恢复原样
	// 	'loginForm.phone'() {
	// 		this.resetVerifyPassing()
	// 	},
	// 	'loginForm.password'() {
	// 		this.resetVerifyPassing()
	// 	}
	// },
	created() {
		// 用户若已登录，自动跳转到首页
		if (this.$store.getters.isLogin) {
			let userName = this.$store.getters.userName
			this.$message({
				message: `${userName} 您已登录！已跳转到网盘首页`,
				center: true,
				type: 'success'
			})
			this.$router.replace({ name: 'File' })
		}
		//  绘制背景图
		this.$nextTick(() => {
			let element = document.getElementById('loginBackground')
			new CanvasNest(element, config)
		})
	},
	mounted() {
		// if (this.screenWidth <= 768) {
		// 	this.loginBtnDisabled = true
		// }
	},
	methods: {
		/**
		 * 重置滑动解锁至未解锁状态
		 * 注册按钮禁用
		 */
		resetVerifyPassing() {
			this.isPassing = true
			this.$refs.dragVerifyRef.reset()
			// if (this.screenWidth > 768) {
			// 	this.loginBtnDisabled = true
			// }
		},
		/**
		 * 滑动解锁完成 回调函数
		 * @param {boolean} isPassing 解锁是否通过
		 */
		updateIsPassing(isPassing) {
			if (isPassing) {
					this.handleUserLogin('loginForm')
			}
		},
		/**
		 * 登录按钮点击事件 表单验证&用户登录
		 * @param {boolean} formName 表单ref值
		 */
		submitForm(formName) {
			this.loginBtnLoading = true
			this.$refs[formName].validate((valid) => {
				if (valid) {
					// 表单各项校验通过
					// if (this.screenWidth > 768) {
					// 	this.handleUserLogin(formName)
					// } else {
					// 	// this.isShowDragVerify = true
					// 	this.loginBtnLoading = false
					// }
          this.handleUserLogin(formName)
				} else {
					this.$message.error('请完善信息！')
					this.loginBtnLoading = false
					return false
				}
			})
		},
		/**
		 * 用户登录
		 */
		handleUserLogin() { //这里传forName
			login(this.loginForm, true)
				.then((res) => {
					this.loginBtnLoading = false
					// if (this.screenWidth <= 768) {
					// 	this.isShowDragVerify = false
					// }
					if (res.success) {
						this.setCookies(this.$config.tokenKeyName, res.data.token) //  存储登录状态
						this.$message.success('登录成功！欢迎来到天涯网盘')
						this.$router.replace(this.url) //  跳转到前一个页面或者网盘主页
            // this.$router.replace({ path: '/file' })
						// this.$refs[formName].resetFields() //  清空表单
					} else {
						this.$message.error('手机号或密码错误！')
						this.isPassing = true
						this.$refs.dragVerifyRef.reset()
					}
				})
				.catch(() => {
					this.loginBtnLoading = false
					// if (this.screenWidth <= 768) {
					// 	this.isShowDragVerify = false
					// }
				})
		}
	}
}
</script>
<style lang="stylus" scoped>
.login-wrapper {
  // height: 550px !important;
  min-height: calc(100vh - 189px) !important;
  padding-top: 50px;

  .form-wrapper {
    width: 375px;
    margin: 0 auto;
    text-align: center;

    .login-title {
      margin-bottom: 10px;
      font-weight: 300;
      font-size: 30px;
      color: #000;
    }

    .login-system {
      font-weight: 300;
      color: #999;
    }

    .login-form {
      width: 100%;
      margin-top: 20px;

      >>> .el-form-item__content {
        margin-left: 0 !important;
      }

      &>>> .el-input__inner {
        font-size: 16px;
      }

      .login-btn-form-item {
        .login-btn {
          width: 100%;
        }

        &>>> .el-button {
          padding: 10px 90px;
          font-size: 16px;
        }
      }
    }

    .tip {
      width: 70%;
      margin-left: 86px;
    }
  }
}
</style>
