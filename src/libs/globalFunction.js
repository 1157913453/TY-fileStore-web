import Vue from 'vue'
import Cookies from 'js-cookie'
import router from '@/router/router'
import config from '@/config/index.js'
import { Message } from 'element-ui'
import { fileImgMap, unknownImg, fileSuffixCodeModeMap } from '@/libs/map.js'

// 全局函数
const globalFunction = {
	/**
	 * 格式化文件大小
	 * @param {number} size 文件大小
	 * @returns {string} 文件大小（带单位）
	 */
	calculateFileSize(size) {
		const B = 1024
		const KB = Math.pow(1024, 2)
		const MB = Math.pow(1024, 3)
		const GB = Math.pow(1024, 4)
		if (size === 0) {
			return '0KB'
		} else if (!size) {
			return '_'
		} else if (size < KB) {
			return `${(size / B).toFixed(0)}KB`
		} else if (size < MB) {
			return (size / KB).toFixed(1) + 'MB'
		} else if (size < GB) {
			return (size / MB).toFixed(2) + 'GB'
		} else {
			return (size / GB).toFixed(3) + 'TB'
		}
	},
	/**
	 * 获取图片缩略图路径
	 * @param {object} row 文件信息
	 * @returns {string} 图片缩略图路径
	 */
	getImgMinPath(row) {
		return `${config.baseContext}/filetransfer/preview?userFileId=${
			row.userFileId
		}&isMin=true&shareBatchNum=${row.shareBatchNum}&extractionCode=${
			row.extractionCode
		}&token=${globalFunction.getCookies(config.tokenKeyName)}`
	},
	/**
	 * 获取文件查看路径
	 * @param {object} row 文件信息
	 * @returns {string} 文件路径
	 */
	getViewFilePath(row) {
		return `${config.baseContext}/filetransfer/preview?userFileId=${
			row.userFileId
		}&isMin=false&shareBatchNum=${row.shareBatchNum}&extractionCode=${
			row.extractionCode
		}&token=${globalFunction.getCookies(config.tokenKeyName)}`
	},
	/**
	 * 获取文件下载路径
	 * @param {object} row 文件信息
	 * @returns {string}  文件下载路径
	 */
	getDownloadFilePath(row) {
		return `${config.baseContext}/filetransfer/downloadfile?userFileId=${
			row.userFileId
		}&shareBatchNum=${row.shareBatchNum}&extractionCode=${
			row.extractionCode
		}&token=${globalFunction.getCookies(config.tokenKeyName)}`
	},
	/**
	 * 获取 Onlyoffice 文件创建路径
	 * @param {object} row
	 * @returns {string} office 文件创建路径
	 */
	createFileOnlineByOffice(data) {
		let fileAddr = `${location.protocol}//${location.host}${config.baseContext}`
		const { href } = router.resolve({
			name: 'Onlyoffice',
			query: {
				fileAddr: fileAddr,
				fileName: data.fileName,
				filePath: data.filePath,
				extendName: data.extendName,
				ot: 'add'
			}
		})
		window.open(href, '_blank')
	},
	/**
	 * 获取 Onlyoffice 文件在线预览路径
	 * @param {object} row
	 * @returns {string} office 文件在线预览路径
	 */
	getFileOnlineViewPathByOffice(row) {
		let fileAddr = ''
		let fileName = row.fileName + '.' + row.extendName
		let filePath = row.fileAddr
		let fileId = row.fileId
		let userFileId = row.userFileId
		let extendName = row.extendName

		fileAddr = `${location.protocol}//${location.host}${
			config.baseContext
		}/filetransfer/preview?userFileId=${
			row.userFileId
		}&isMin=false&shareBatchNum=${row.shareBatchNum}&extractionCode=${
			row.extractionCode
		}&token=${globalFunction.getCookies(config.tokenKeyName)}`
		const { href } = router.resolve({
			name: 'Onlyoffice',
			query: {
				fileAddr: fileAddr,
				fileName: fileName,
				filePath: filePath,
				fileId: fileId,
				userFileId: userFileId,
				extendName: extendName,
				ot: 'detail'
			}
		})
		window.open(href, '_blank')
	},
	/**
	 * 获取 Onlyoffice 文件在线编辑路径
	 * @param {object} row
	 * @returns {string} office 文件在线编辑路径
	 */
	getFileOnlineEditPathByOffice(row) {
		let fileAddr = ''
		let fileName = row.fileName + '.' + row.extendName
		let filePath = row.fileAddr
		let fileId = row.fileId
		let userFileId = row.userFileId
		let extendName = row.extendName

		fileAddr = `${location.protocol}//${location.host}${
			config.baseContext
		}/filetransfer/preview?userFileId=${
			row.userFileId
		}&isMin=false&shareBatchNum=${row.shareBatchNum}&extractionCode=${
			row.extractionCode
		}&token=${globalFunction.getCookies(config.tokenKeyName)}`
		const { href } = router.resolve({
			name: 'Onlyoffice',
			query: {
				fileAddr: fileAddr,
				fileName: fileName,
				filePath: filePath,
				fileId: fileId,
				userFileId: userFileId,
				extendName: extendName,
				ot: 'edit'
			}
		})
		window.open(href, '_blank')
	},
	/**
	 * 设置 Cookies
	 * @param {string} name 名称
	 * @param {string} value 值
	 * @param {object} others 域名、路径、有效期等，封装到对象中
	 */
	setCookies(name, value, others = null) {
		Cookies.set(name, value, { domain: config.domain, ...others })
	},
	/**
	 * 获取 Cookies
	 * @param {string} name 名称
	 * @param {object} others 域名、路径等，封装到对象中
	 * @returns {string} Cookies 值
	 */
	getCookies(name, others = null) {
		return Cookies.get(name, { domain: config.domain, ...others })
	},
	/**
	 * 移除 Cookies
	 * @param {string} name 名称
	 * @param {object} others 域名、路径等，封装到对象中
	 */
	removeCookies(name, others = null) {
		Cookies.remove(name, { domain: config.domain, ...others })
	},
	/**
	 * 获取分享链接
	 * @param {string} shareBatchNum
	 * @returns {string} 完整的分享链接
	 */
	getShareLink(shareBatchNum) {
		return `${location.protocol}//${location.host}/share/${shareBatchNum}`
	},
	/**
	 * 复制分享链接
	 * @param {string} shareBatchNum
	 * @param {string} extractionCode
	 */
	copyShareLink(shareBatchNum, extractionCode) {
		let input = document.createElement('textarea') // 直接构建textarea以保持换行
		input.value =
			extractionCode === null
				? `分享链接：${this.getShareLink(
						shareBatchNum
				  )}\n复制链接到浏览器中并输入提取码即可查看文件`
				: `分享链接：${this.getShareLink(
						shareBatchNum
				  )}\n提取码：${extractionCode}\n复制链接到浏览器中并输入提取码即可查看文件` // 设置内容
		document.body.appendChild(input) // 添加临时实例
		input.select() // 选择实例内容
		document.execCommand('Copy') // 执行复制
		document.body.removeChild(input) // 删除临时实例
		Message.success('复制成功')
	},
	/**
	 * 根据文件扩展名设置文件图片
	 * @param {object} file 文件信息
	 */
	setFileImg(file) {
		if (file.isDir === 1) {
			//  文件夹
			return fileImgMap.get('dir')
		} else if (
			Number(router.currentRoute.query.fileType) !== 6 &&
			['jpg', 'png', 'jpeg', 'gif', 'mp4'].includes(
				file.extendName.toLowerCase()
			)
		) {
			// 图片、视频类型，直接显示缩略图
			return this.getImgMinPath(file)
		} else if (fileImgMap.has(file.extendName.toLowerCase())) {
			// 可以识别文件类型的文件
			return fileImgMap.get(file.extendName.toLowerCase())
		} else {
			// 无法识别文件类型的文件
			return unknownImg
		}
	},
	/**
	 * 图片预览
	 * @param {*} currentIndex 当前图片索引
	 * @param {*} imgInfo 单个图片信息
	 * @param {*} imgInfoList 多个图片列表
	 */
	handleImgPreview(currentIndex, imgInfo = {}, imgInfoList = []) {
		// 图片分类下 - 传递整个页面的图片列表；非图片分类下 - 由单个图片构建图片列表
		const imgList =
			Number(router.currentRoute.query.fileType) === 1
				? imgInfoList.map((item) => {
						return {
							...item,
							fileAddr: this.getViewFilePath(item),
							downloadLink: this.getDownloadFilePath(item)
						}
				  })
				: [
						{
							...imgInfo,
							fileAddr: this.getViewFilePath(imgInfo),
							downloadLink: this.getDownloadFilePath(imgInfo)
						}
				  ]
		const defaultIndex =
			Number(router.currentRoute.query.fileType) === 1 ? currentIndex : 0
		Vue.prototype.$previewImg({ imgList, defaultIndex })
	},
	/**
	 * 视频预览
	 * @param {*} currentIndex 当前视频索引
	 * @param {*} videoInfo 单个视频信息
	 * @param {*} videoInfoList 多个视频列表
	 */
	handleVideoPreview(currentIndex, videoInfo = {}, videoInfoList = []) {
		// 视频分类下 - 传递整个页面的视频列表；非视频分类下 - 由单个视频构建视频列表
		const videoList =
			Number(router.currentRoute.query.fileType) === 3
				? videoInfoList.map((item) => {
						return {
							...item,
							fileAddr: this.getViewFilePath(item),
							downloadLink: this.getDownloadFilePath(item)
						}
				  })
				: [
						{
							...videoInfo,
							fileAddr: this.getViewFilePath(videoInfo),
							downloadLink: this.getDownloadFilePath(videoInfo)
						}
				  ]
		const defaultIndex =
			Number(router.currentRoute.query.fileType) === 3 ? currentIndex : 0
		Vue.prototype.$previewVideo({ videoList, defaultIndex })
	},
	/**
	 * 文件预览
	 * @description 若当前点击的为文件夹，则进入文件夹内部；若是文件，则进行相应的预览。
	 * @param {object} row 文件信息
	 * @param {number} currentIndex 当前文件索引
	 * @param {array} fileList 文件列表
	 */
	handleFileNameClick(row, currentIndex, fileList = []) {
		// 如果当前文件在回收站中，则不允许预览
		if (row.deleteFlag !== undefined && row.deleteFlag !== 0) {
			return false
		}
		// 若是文件夹则进入该文件夹
		if (row.isDir) {
			if (router.currentRoute.name === 'Share') {
				// 当前是查看他人分享列表的页面
				router.push({
					query: {
						filePath: row.shareFilePath + row.fileName + '/'
					}
				})
			} else if (Number(router.currentRoute.query.fileType) === 8) {
				// 当前是我的已分享列表页面
				router.push({
					query: {
						fileType: 8,
						filePath: row.shareFilePath + row.fileName + '/',
						shareBatchNum: row.shareBatchNum
					}
				})
			} else if (Number(router.currentRoute.query.fileType) !== 6) {
				// 回收站页面不允许打开文件夹
				// 网盘页面
				router.push({
					query: {
						filePath: row.filePath + row.fileName + '/',
						fileType: 0
					}
				})
			}
		}
		// 若是文件，则进行相应的预览
		else {
			// 若当前点击项是图片
			const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
			if (PIC.includes(row.extendName.toLowerCase())) {
				this.handleImgPreview(currentIndex, row, fileList)
				return false
			}
			//  若当前点击项是可以使用office在线预览的
			if (
				[...this.officeFileType, 'pdf'].includes(row.extendName.toLowerCase())
			) {
				this.getFileOnlineViewPathByOffice(row)
				return false
			}
			//  若当前点击项是代码或文本文件
			let codeFileSuffix = row.extendName.toLowerCase()
			if (codeFileSuffix === 'yaml') {
				codeFileSuffix = 'yml'
			}
			if (fileSuffixCodeModeMap.has(codeFileSuffix)) {
				Vue.prototype.$previewCode({ fileInfo: row })
				return false
			}
			//  若当前点击项是 markdown 文档
			const MARKDOWN = ['markdown', 'md']
			if (MARKDOWN.includes(row.extendName.toLowerCase())) {
				Vue.prototype.$previewMarkdown({ fileInfo: row })
				return false
			}
			//  若当前点击项是视频mp4格式
			const VIDEO = ['mp4']
			if (VIDEO.includes(row.extendName.toLowerCase())) {
				this.handleVideoPreview(currentIndex, row, fileList)
				return false
			}
			//  若当前点击项是音频mp3格式
			const AUDIO = ['mp3']
			if (AUDIO.includes(row.extendName.toLowerCase())) {
				Vue.prototype.$preivewAudio({
					audioObj: row
				})
				return false
			}
		}
	},
	/**
	 * 文件名称拼接，包括文件名称 + 文件后缀
	 * @param {object} file 文件信息
	 * @param {boolean} isHighlight 是否需要展示高亮效果，默认不需要
	 * @returns {string} 完整文件名称
	 */
	getFileNameComplete(file, isHighlight = false) {
		return isHighlight === true && file.highlightFields
			? `${file.highlightFields}${
					file.isDir === 0 && file.extendName ? `.${file.extendName}` : ''
			  }`
			: `${file.fileName}${
					file.isDir === 0 && file.extendName ? `.${file.extendName}` : ''
			  }`
	},
	/**
	 * 获取文件分享过期状态
	 * @param {string} time 日期
	 * @returns {boolean} 是否过期
	 */
	getFileShareStatus(time) {
		if (new Date(time).getTime() > new Date().getTime()) {
			return false
		} else {
			return true
		}
	}
}

export default globalFunction
