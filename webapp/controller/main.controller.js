sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"zuploadExecl/model/jszip",
	"zuploadExecl/model/xlsx",
	"sap/ui/model/json/JSONModel",
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
	'sap/m/MessageBox'
], function(Controller, jszip, xlsx, JSONModel,Export,ExportTypeCSV,MessageBox) {
	"use strict";

	return Controller.extend("zuploadExecl.controller.main", {
          result: {},
       //加载导入EXECL文件解析出JSON文件绑定JSONmodel中     
		  handleUploadPress: function() {
	              var print ;
	              console.log(print);
			        if (this.result) {
                                 var JSONString = JSON.stringify(this.result);
                                 var JSONObject = JSON.parse(JSONString);
                                 var oJSONModel = new JSONModel();
                                     oJSONModel.setData(JSONObject);
                                     this.getView().setModel(oJSONModel,"fy");
                                   }

		},

      //导入EXECLjiex解析成JSON字符串方法
		_import: function(file) {
			if (file && window.FileReader) {
				var reader = new FileReader();
				var result = {},
					data;
				var that = this;
				reader.onload = function(e) {
					data = e.target.result;
					//XLSX: Defined in xlsx.js
					var wb = XLSX.read(data, {
						type: 'binary'
					});
					wb.SheetNames.forEach(function(sheetName) {

						var roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
						var jsonObjString = JSON.stringify(roa);
						if (roa.length > 0) {
							result[sheetName] = roa;
						}
					});
				};

				reader.readAsBinaryString(file);

				reader.onloadend = function(e) {

					that.result = result;

				};

			}

		},
	 // 响应导入按键事件方法 	
		handleUploadchange:function(){
		  var oFileUploader = this.getView().byId("fileUploader");
           var oFile = oFileUploader.oFileUpload.files[0];
           this._import(oFile);  
		},
		//导出方法
		handledownloaddPress:function(){
		    	var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType : new ExportTypeCSV({
					separatorChar : ";"
				}),

				// Pass in the model created above
				// 指定数据MODEL 如果有别名，需需指定别名
				models : this.getView().getModel("fy"),

				// binding information for the rows aggregation
				rows : {
				    // 在数据绑定时不需要前面指定别名 fy>/data  fy> 必须省掉 
					path : '/data'
				},

				// column definitions with column name and binding info for the content

				columns : [{
				      // 设置导出字段名  fybm
					name : "fybm",
					template : {
					      // 在数据绑定时不需要前面指定别名 fy>fybm  fy> 必须省掉 
						content : "{fybm}"
					}
				}, {
					name : "fyms",
					template : {
						content : "{fyms}"
					}
				}, {
					name : "m1",
					template : {
						content : "{m1}"
					}
				}, {
					name : "m2",
					template : {
						content : "{m2}"
					}
				}, {
					name : "m3",
					template : {
						content : "{m3}"
					}
				}, {
					name : "m4",
					template : {
						content : "{m4}"
					}
				}]
			});
			
					// download exported file
			oExport.saveFile().catch(function(oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
			});

		}
		

	});
});