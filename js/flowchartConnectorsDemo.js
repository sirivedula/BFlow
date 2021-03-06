;(function() {
	
	window.jsPlumbDemo = {
		init : function() {
				
			jsPlumb.importDefaults({
				// default drag options
				DragOptions : { cursor: 'pointer', zIndex:2000 },
				// default to blue at one end and green at the other
				EndpointStyles : [{ fillStyle:'#225588' }, { fillStyle:'#558822' }],
				// blue endpoints 7 px; green endpoints 11.
				Endpoints : [ [ "Dot", {radius:5} ], [ "Dot", { radius:5 } ]],
				// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
				// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
				ConnectionOverlays : [
					[ "Arrow", { location:-10 } ],
					[ "Label", { 
						location:0.1,
						id:"label",
						cssClass:"aLabel"
					}]
				]
			});			

			// this is the paint style for the connecting lines..
			var connectorPaintStyle = {
				lineWidth:4,
				strokeStyle:"#deea18",
				joinstyle:"round",
				outlineColor:"#EAEDEF",
				outlineWidth:2
			},
			// .. and this is the hover style. 
			connectorHoverStyle = {
				lineWidth:4,
				strokeStyle:"#2e2aF8"
			},
			endpointHoverStyle = {fillStyle:"#2e2aF8"},
			// the definition of source endpoints (the small blue ones)
			sourceEndpoint = {
				endpoint:"Dot",
				paintStyle:{ 
					strokeStyle:"#225588",
					fillStyle:"transparent",
					radius:4,
					lineWidth:2 
				},				
				isSource:true,
				connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:4, alwaysRespectStubs:true } ],								                
				connectorStyle:connectorPaintStyle,
				hoverPaintStyle:endpointHoverStyle,
				connectorHoverStyle:connectorHoverStyle,
                dragOptions:{},
                overlays:[
                	[ "Label", { 
	                	location:[0.5, 1.5], 
	                	label:"",
	                	cssClass:"endpointSourceLabel" 
	                } ]
                ]
			},
			// a source endpoint that sits at BottomCenter
		//	bottomSource = jsPlumb.extend( { anchor:"BottomCenter" }, sourceEndpoint),
			// the definition of target endpoints (will appear when the user drags a connection) 
			targetEndpoint = {
				endpoint:"Dot",					
				paintStyle:{ fillStyle:"#558822",radius:4 },
				hoverPaintStyle:endpointHoverStyle,
				maxConnections:-1,
				dropOptions:{ hoverClass:"hover", activeClass:"active" },
				isTarget:true,			
                overlays:[
                	[ "Label", { location:[0.5, -0.5], label:"", cssClass:"endpointTargetLabel" } ]
                ]
			},			
			init = function(connection) {
				connection.getOverlay("label").setLabel(connection.sourceId.substring(6) + "-" + connection.targetId.substring(6));
				connection.bind("editCompleted", function(o) {
					if (typeof console != "undefined")
						console.log("connection edited. path is now ", o.path);
				});
			};			

			var allSourceEndpoints = [], allTargetEndpoints = [];
				_addEndpoints = function(toId, sourceAnchors, targetAnchors) {
					for (var i = 0; i < sourceAnchors.length; i++) {
						var sourceUUID = toId + sourceAnchors[i];
						allSourceEndpoints.push(jsPlumb.addEndpoint(toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID }));						
					}
					for (var j = 0; j < targetAnchors.length; j++) {
						var targetUUID = toId + targetAnchors[j];
						allTargetEndpoints.push(jsPlumb.addEndpoint(toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID }));						
					}
				};

			_addEndpoints("window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);			
			_addEndpoints("window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
			_addEndpoints("window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
			_addEndpoints("window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);
						
			// listen for new connections; initialise them the same way we initialise the connections at startup.
			jsPlumb.bind("jsPlumbConnection", function(connInfo, originalEvent) { 
				init(connInfo.connection);
			});			
						
			// make all the window divs draggable						
			jsPlumb.draggable(jsPlumb.getSelector(".window"), { grid: [20, 20] });		
			// THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector 
			// method, or document.querySelectorAll:
			//jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });
            
			// connect a few up
			jsPlumb.connect({uuids:["window2BottomCenter", "window3TopCenter"], editable:true});
			jsPlumb.connect({uuids:["window2LeftMiddle", "window4LeftMiddle"], editable:true});
			jsPlumb.connect({uuids:["window4TopCenter", "window4RightMiddle"], editable:true});
			jsPlumb.connect({uuids:["window3RightMiddle", "window2RightMiddle"], editable:true});
			jsPlumb.connect({uuids:["window4BottomCenter", "window1TopCenter"], editable:true});
			jsPlumb.connect({uuids:["window3BottomCenter", "window1BottomCenter"], editable:true});
			//
            
			//
			// listen for clicks on connections, and offer to delete connections on click.
			//
			jsPlumb.bind("click", function(conn, originalEvent) {
				if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
					jsPlumb.detach(conn); 
			});	
			
			jsPlumb.bind("connectionDrag", function(connection) {
				console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
			});		
			
			jsPlumb.bind("connectionDragStop", function(connection) {
				console.log("connection " + connection.id + " was dragged");
			});
		}
	};
})();