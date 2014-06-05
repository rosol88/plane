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
			onCfgSelect(cmb);
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
			    	onCfgSelect(cmb);
			    }
			});
		},
		renderHistory:function(hist){
			var d=new Date(hist.date);
			var sDate=d.getFullYear()+"-";
			sDate+=d.getMonth()+1+'-';
			sDate+=d.getDate();
			sDate=hist.id+" - "+sDate;
			return '<option>'+sDate+'</option>';
		},
		add:function(hist){
			//hist.date=hist.date.getTime();
			//this.history.unshift(hist);
			//this.history.length=Math.min(this.maxLength,this.history.length);
			//localStorage.setItem('cfgHistory',JSON.stringify(this.history));
			//hist.date=new Date(hist.date);
			for(var i in hist){
				
				if(hist.hasOwnProperty(i)){
					if(i.startsWith('vel') || i.startsWith('pos')){
						hist[i]=parseFloat(hist[i]);
					}
				}
			}
			var me=this;
			$.ajax({
				    url: 'history',
				    type: 'POST',
				    data: JSON.stringify(hist),
				    contentType: 'application/json; charset=utf-8',
				    dataType: 'json',
				    async: true,
				    success: function(id){
				    	console.log(arguments);
				    	hist.id=id;
				    	hist.date=hist.date.getTime();
						me.history.unshift(hist);
						me.history.length=Math.min(me.maxLength,me.history.length);
						localStorage.setItem('cfgHistory',JSON.stringify(me.history));
				    }
				});
		},
		get:function(){
			return this.history;
		}
};