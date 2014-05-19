function CfgHistory() {
	this.load();
};

CfgHistory.prototype = {
		history:[],
		dbHistory:null,
		maxLength:3,
		clear:function(){
			localStorage.clear();
		},
		load:function(){
			var jsonHistory=localStorage.getItem('cfgHistory');
			
			if(jsonHistory!=null){
				this.history=JSON.parse(jsonHistory);
				for(var i=0;i<this.history.length;i++){
					this.history[i].date=new Date(this.history[i].date);
				}
			}
		},
		loadCombo:function(cmb){
			cmb.empty();
			for(var i=0;i<this.history.length;i++){
				cmb.append( this.renderHistory(this.history[i]));
			}
		},
		loadAll:function(cmb){
			cmb.empty();
			var me=this;
			$.ajax({
			    url: 'history',
			    type: 'GET',
			    dataType: 'json',
			    async: true,
			    success: function(list){
			    	console.log(arguments);
			    	me.dbHistory=list;
			    	for(var i=0;i<list.length;i++){
						cmb.append( me.renderHistory(list[i],i));
						cmb.children().last().data('json',list[i]);
					}
			    }
			});
		},
		renderHistory:function(hist){
			return '<option>'+JSON.stringify(hist)+'</option>';
		},
		add:function(hist){
			hist.date=hist.date.getTime();
			this.history.unshift(hist);
			this.history.length=Math.min(this.maxLength,this.history.length);
			localStorage.setItem('cfgHistory',JSON.stringify(this.history));
			hist.date=new Date(hist.date);
			
			$.ajax({
				    url: 'history',
				    type: 'POST',
				    data: JSON.stringify(hist),
				    contentType: 'application/json; charset=utf-8',
				    dataType: 'json',
				    async: true,
				    success: function(){
				    	console.log(arguments);
				    }
				});
		},
		get:function(){
			return this.history;
		}
};