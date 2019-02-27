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
		},
		isMask:{
			type:Boolean,
			value:true
		}
		
	},
	methods: {
		close(){
			if(this.data.isMask){
				this.setData({show:false})
			}
			
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



