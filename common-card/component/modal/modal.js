Component({
	properties: {
		data:{
			type:Object
		},
		title:{
			type:Object,
		},
		show: {
			type:Boolean,
			value:false
		}
		
	},
	methods: {
		close(){
			this.setData({show:false})
		},
		handleClickItem({ currentTarget = {} }){
			const dataset = currentTarget.dataset || {};
			const { index } = dataset;
			this.triggerEvent('click', { index });
			setTimeout(()=>{
				this.setData({show:false})
			},600)
		}
	}
});



