var React = require('react'),
	_ = require('underscore'),
	util = require('util'),
	Panel = require('./comps/panel.jsx').Panel,
	Layout = require('./comps/layout.jsx').Layout,
	Clearfix = require('./comps/clearfix.jsx').Clearfix,
	color = require('./utils/util.js').color,
	DarkBlueSmallToggleBtn = require('./comps/btn.jsx').DarkBlueSmallToggleBtn;

Array.prototype.remove = require('array-remove-by-value');


var apiData = {
	DateUtil: {
		'String format(date, format)': {
			desc: [ 'long 형으로 주어진 시간(date)을 포맷(format)에 맞춰서 출력한다.elong형의 시간 값은 DateUtil.parse(), DateUtil.currentTimeMillis()를 통해서 구할 수 있다.', ],
			returns: '포맷팅된 날짜',
			example: [
				'var formattedDate = dateUtil.format(1414460642364, \'yyyyMMddHHmmss\'); // => 20141028104502',
				'var formattedDate = dateUtil.format(1414460642364, \'yyyyMMdd\'); // => 20141028 ',
				'var formattedDate = dateUtil.format(1414460642364, \'yyyy-MM-dd\'); // => 2014-10-28'
			],
			tag: [ 'date' ],
			visible: true
		},
		'long parse(date, format)': {
			desc: [ '포맷(format)에 맞춰 포맷팅된 시간값(date)을 long 형태의 시간 값으로 변환한다.' ],
			returns: 'long 타입의 시간 값',
			example: [
				'var dateValue = dateUtil.parse(\'20141028104502\', \'yyyyMMddHHmmss\'); // => 1414460642364 ',
				'var dateValue = dateUtil.parse(\'20141028\', \'yyyyMMdd\'); // => 1414422000000 ',
				'var dateValue = dateUtil.parse(\'2014 10-28\', \'yyyy MM-dd\'); // => 1414422000000'
			],
			tag: [ 'date' ],
			visible: true
		},
		'long currentTimeMillis()': {
			desc: [ '현재 시간을 long 형태의 시간 값으로 변환한다.' ],
			returns: 'long 타입의 시간값',
			example: [
				'var currentTime = dateUtil.currentTimeMillis(); // => 1414460642364'
			],
			tag: [ 'date' ],
			visible: true
		}
	},
	dbHandler: {
		'void update({ database(required), query(required) })': {
			desc: [ '지정된 데이터베이스(database)에 대해 insert, update, delete query를 실행한다.' ],
			example: [
				'var database = {',
				'	driver: \'oracle.jdbc.driver.OracleDriver\', //(required)',
				'	connUrl: \'jdbc:oracle:thin:@192.168.10.1:1521:spiderx\', //(required)',
				'	username: \'admin\', //(required)',
				'	password: \'admin\', //(required)',
				'	isUserEncrypted: \'false\' //(default: true)',
				'};',
				'dbHandler.update({database: database, query: \'delete from test_table\'});'
			],
			tag: [ 'database', 'insert', 'update', 'delete' ],
			visible: true
		},
		'void batch({ database(required), queries(required) })': {
			desc: [ '지정된 데이터베이스(database)에 대해 insert, update, delete query를 배치로 실행한다.' ],
			example: [
				'var database = { ',
				'	driver: \'oracle.jdbc.driver.OracleDriver\', //(required) ',
				'	connUrl: \'jdbc:oracle:thin:@192.168.10.1:1521:spiderx\', //(required) ',
				'	username: \'admin\', //(required) ',
				'	password: \'admin\', //(required)',
				'	isUserEncrypted: \'false\' //(default: true) ',
				'}; ',
				'dbHandler.update({ ',
				'	database: database, ',
				'	queries: [ ',
				'		\'insert into test_table (col) values("test1")\', ',
				'		\'insert into test_table (col) values("test2")\', ',
				'		\'insert into test_table (col) values("test3")\' ',
				'	]',
				'});'
			],
			tag: [ 'database', 'insert', 'update', 'delete' ],
			visible: true
		},
		'void selectAndAppend({ database(required), query(required), delimiter(default: "|"), writer(required) })': {
			desc: [
				'지정된 데이터베이스(database)에 대해서 select 쿼리를 실행한 결과를 곧바로 파일로 출력한다. 출력되는 데이터들의 row간 구분자는 "\\n", column 간 구분자는 delimiter로 구성된다.'
			],
			example: [
				'var database = {',
				'	driver: \'oracle.jdbc.driver.OracleDriver\', //(required)',
				'	connUrl: \'jdbc:oracle:thin:@192.168.10.1:1521:spiderx\', //(required)',
				'	username: \'admin\', //(required)',
				'	password: \'admin\', //(required)',
				'	isUserEncrypted: \'false\' //(default: true)',
				'};',
				'var writer = fileWriterFactory.getWriter({',
				'	filename: \'/data/output.txt\',',
				'	charset: \'utf8\'',
				'});',
				'dbHandler.selectAndAppend({',
				'	database: database,',
				'	query: \'select * from test_table\', //(required)',
				'	delimiter: \'|\', //(default \'|\')',
				'	writer: writer //(required)',
				'});'
			],
			tag: [ 'database', 'select' ],
			visible: true
		},
		'void selectAndInsert({ srcDatabase(required), selectQuery(required), destDatabase(required), insertQuery(required) })': {
			desc: [
				'TODO'
			],
			example: [
				'dbHandler.selectAndInsert({',
				'	srcDatabase: {',
				'		driver: \'oracle.jdbc.driver.OracleDriver\', //(required)',
				'		connUrl: \'jdbc:oracle:thin:@192.168.10.1:1521:spiderx\', //(required)',
				'		username: \'admin\', //(required)',
				'		password: \'admin\', //(required)',
				'		isUserEncrypted: \'false\' //(default: true)',
				'	},',
				'	selectQuery: \'select srcCol1, srcCol2, srcCol3 from test_src_table\',',
				'	destDatabase: {',
				'		driver: \'oracle.jdbc.driver.OracleDriver\', //(required)',
				'		connUrl: \'jdbc:oracle:thin:@192.168.10.100:1521:test\', //(required)',
				'		username: \'admintest\', //(required)',
				'		password: \'admintest\', //(required)',
				'		isUserEncrypted: \'false\' //(default: true)',
				'	},',
				'	insertQuery: \'insert into test_dest_table (destCol1, destCol2, destCol3) values(?, ?, ?)\'',
				'});'
			],
			tag: [ 'database', 'select', 'insert' ],
			visible: true
		}
	}
};


var store = (function() {
	var listeners = [];

	var actions = {
		changeKeyword: 'changeKeyword',
		selectedTags: 'selectedTags'
	};
	var dispatch = function(type, data) {
		listeners.forEach(function(listener) {
			listener(type, data);
		});
	};
	var listen = function(listener) {
		listeners.push(listener);
	};

	return { actions: actions, dispatch: dispatch, listen: listen };
})();


var ApiView = React.createClass({
	getInitialState() {
		return {
			apiData: apiData,
			keyword: '',
			selectedTags: []
		};
	},

	filterDataApi(keyword, selectedTags) {
		var setVisibleOfMethodData = function(methodName, methodData) {
			if(keyword === '' && selectedTags.length === 0) {
				methodData.visible = true;
				return;
			}

			methodData.visible = false;
			if(keyword !== '') {
				var methodDataStr = [ methodName ];
				if(methodData.desc) methodDataStr = methodDataStr.concat(methodData.desc);
				if(methodData.returns) methodDataStr.push(methodData.returns);
				if(methodData.example) methodDataStr = methodDataStr.concat(methodData.example);
				methodDataStr.every(function(line) {
					if(line.indexOf(keyword) > -1) {
						methodData.visible = true;
						return false;
					}
					return true;
				});
			}

			if(methodData.visible === true) return;
			if(selectedTags.length !== 0) {
				methodData.tag.every(function(singleTag) {
					if(selectedTags.indexOf(singleTag) > -1) {
						methodData.visible = true;
						return false;
					}
					return true;
				});
			}
		};

		Object.keys(apiData).forEach(function(className) {
			var classData = apiData[className];
			Object.keys(classData).forEach(function(methodName) {
				var methodData = classData[methodName];
				setVisibleOfMethodData(methodName, methodData);
			});
		});
		return apiData;
	},

	componentDidMount() {
		store.listen(function(type, data) {
			if(type !== store.actions.changeKeyword) return;
			var keyword = data;
			var apiData = this.filterDataApi(keyword, this.state.selectedTags);
			this.setState({ apiData: apiData, keyword: keyword });
		}.bind(this));

		store.listen(function(type, data) {
			if(type !== store.actions.selectedTags) return;
			var tag = data.tag;
			var isSelected = data.isSelect;
			if(isSelected === true) {
				if(this.state.selectedTags.indexOf(tag) > -1) return;
				var selectedTags = this.state.selectedTags.concat([ tag ]);
				var apiData = this.filterDataApi(this.state.keyword, selectedTags);
				this.setState({ selectedTags: selectedTags, apiData: apiData });
			} else {
				if(this.state.selectedTags.indexOf(tag) === -1) return;
				var selectedTags = this.state.selectedTags.concat([]).remove(tag);
				var apiData = this.filterDataApi(this.state.keyword, selectedTags);
				this.setState({ selectedTags: selectedTags, apiData: apiData });
			}
		}.bind(this));
	},

	render() {
		var body = [];

		Object.keys(this.state.apiData).forEach(function(className) {
			var classData = this.state.apiData[className];
			var isClassVisible = false;
			Object.keys(classData).every(function(methodName) {
				var methodVisible = classData[methodName].visible;
				if(methodVisible === true) {
					isClassVisible = true;
					return false;
				}
				return true;
			}.bind(this));

			if(isClassVisible === true) {
				body.push(
					<ApiClassBox 
						key={className} 
						name={className} 
						data={classData}
						selectedTags={this.state.selectedTags} />
				);
			}
		}.bind(this));

		return (
			<div>
				<div style={{ marginBottom: '10px' }}>
					<HashTag />
					<Search />
					<Clearfix />
				</div>
				<div>
					{body}
				</div>
			</div>
		);
	}
});



var HashTagBtn = React.createClass({
	getDefaultProps() {
		return {
			tag: '',
			isClicked: false
		};
	},

	onToggle(isSelected) {
		store.dispatch(store.actions.selectedTags, {
			tag: this.props.tag,
			isSelect: isSelected
		});
	},

	render() {
		return (
			<DarkBlueSmallToggleBtn 
				ref="btn"
				onToggle={this.onToggle}
				isClicked={this.props.isClicked}>
				<span>#</span>
				{this.props.tag}
			</DarkBlueSmallToggleBtn>
		);
	}
});


var HashTag = React.createClass({
	getInitialState() {
		return {
			tags: []
		}
	},

	componentDidMount() {
		var allTags = [];
		Object.keys(apiData).forEach(function(className) {
			var classData = apiData[className];
			Object.keys(classData).forEach(function(methodName) {
				var methodData = classData[methodName];
				if(methodData.tag) {
					methodData.tag.forEach(function(tag) {
						if(_.contains(allTags, tag) === false)
							allTags.push(tag);
					});
				}
			});
		});

		this.setState({ tags: allTags });
	},

	render() {
		var body = this.state.tags.map(function(tag) {
			return (<HashTagBtn key={tag} tag={tag} />);
		});

		return (
			<div style={{ float: 'left' }}>{body}</div>
		);
	}
});


var Search = React.createClass({
	onChange(evt) {
		var keyword = evt.target.value;
		store.dispatch(store.actions.changeKeyword, keyword);
	},

	render() {
		var inputStyle = { 
			float: 'right',
			border: '1px dashed ' + color.gray,
			padding: '3px'		
		};
		return (
			<input 
				style={inputStyle} 
				type="text" 
				placeholder="search..." 
				onChange={this.onChange} /> 
		);
	}
});


var ApiClassBox = React.createClass({
	getDefaultProps() {
		return {
			name: '',
			data: null,
			selectedTags: []
		};
	},

	render() {
		if(this.props.data === null) return null;

		var body = [];
		Object.keys(this.props.data).forEach(function(methodName) {
			var methodData = this.props.data[methodName];
			body.push(
				<ApiMethodBox 
					key={methodName} 
					name={methodName} 
					data={methodData}
					selectedTags={this.props.selectedTags} />
			);
		}.bind(this));

		return (
			<Panel>
				<Panel.Heading glyphicon="console">{this.props.name}</Panel.Heading>
				<Panel.Body>
					{body}
				</Panel.Body>
			</Panel>
		);
	}
});


var ApiMethodBox = React.createClass({
	getDefaultProps() {
		return { 
			name: '',
			data: null,
			selectedTags: []
		};
	},

	render() {
		var outerDivStyle = {
			borderLeft: '6px solid ' + color.darkBlue,
			paddingLeft: '10px',
			marginBottom: '30px'
		};
		if(this.props.data.visible === false)
			outerDivStyle.display = 'none';

		var items = [];
		if(this.props.data.desc) {
			this.props.data.desc.forEach(function(desc) {
				items.push(
					<ApiMethodBox.Item 
						data={desc} 
						key={desc} />
				);
			}.bind(this));
		}
		if(this.props.data.returns) {
			items.push(
				<ApiMethodBox.Item 
					data={'returns ' + this.props.data.returns} 
					key={this.props.data.returns} />
			);
		}

		var body = [];
		if(items.length !== 0)
			body.push(<ul key={this.props.name}>{items}</ul>);

		if(this.props.data.example)
			body.push(
				<ApiMethodBox.Example 
					key={this.props.data.example} 
					code={this.props.data.example} />
			);

		var tagBtns = [];
		this.props.data.tag.forEach(function(tag) {
			var isSelected = this.props.selectedTags.indexOf(tag) > -1;
			var key = util.format('%s_%s', this.props.name, tag);
			tagBtns.push( <HashTagBtn key={key} tag={tag} isClicked={isSelected} /> );
		}.bind(this));

		return (
			<div style={outerDivStyle}>
				<h5>{this.props.name}</h5>
				<div>{tagBtns}</div>
				<div>{body}</div>
			</div>
		);
	}
});


ApiMethodBox.ItemList = React.createClass({
	render() {
		return (<ul>{this.props.children}</ul>);
	}
});


ApiMethodBox.Item = React.createClass({
	getDefaultProps() {
		return { 
			data: ''
		};
	},

	render() {
		return (<li style={{marginLeft: '25px'}}>{this.props.data}</li>);
	}
});


ApiMethodBox.Example = React.createClass({
	editor: null,
	editorId: null,

	getDefaultProps() {
		return { code: [] };
	},

	componentWillMount() {
		this.editorId = Math.random() + ''
	},

	componentDidMount() {
		this.editor = ace.edit(this.editorId);
		this.editor.setTheme('ace/theme/github');
		this.editor.getSession().setMode('ace/mode/javascript');
		this.editor.setKeyboardHandler('ace/keyboard/vim');
		this.editor.setReadOnly(true);
		this.editor.setOptions({
			fontFamily: 'consolas'
		});
	},

	render() {
		var codeLine = this.props.code.length;
		var code = this.props.code.join('\n');

		var outerDivStyle = {
			position: 'relative',
			height: ((codeLine*14)+15) + 'px'		
		};

		var innerPreStyle = {
			position: 'absolute',
			top: '0px',
			bottom: '0px',
			right: '10px',
			left: '10px'
		};

		return (
			<div style={outerDivStyle}>
				<pre id={this.editorId} style={innerPreStyle}>
					{code}
				</pre>
				<Clearfix />
			</div>
		);
	}
});



React.render(
	<Layout active="api">
		<ApiView />
	</Layout>,
	document.body
);





















// React.render(
// 	<Layout active="api">
// 		<ApiView>
// 			<ApiClassBox apiClassName="DateUtil">
// 				<ApiMethodBox methodName="String format(date, format)">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>long 형으로 주어진 시간(date)을 포맷(format)에 맞춰서 출력한다.elong형의 시간 값은 DateUtil.parse(), DateUtil.currentTimeMillis()를 통해서 구할 수 있다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Returns 포맷팅된 날짜</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var formattedDate = dateUtil.format(1414460642364, 'yyyyMMddHHmmss'); // => 20141028104502
// 						var formattedDate = dateUtil.format(1414460642364, 'yyyyMMdd'); // => 20141028
// 						var formattedDate = dateUtil.format(1414460642364, 'yyyy-MM-dd'); // => 2014-10-28
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="long parse(date, format)">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>포맷(format)에 맞춰 포맷팅된 시간값(date)을 long 형태의 시간 값으로 변환한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Returns long 타입의 시간 값</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var dateValue = dateUtil.parse('20141028104502', 'yyyyMMddHHmmss'); // => 1414460642364
// 						var dateValue = dateUtil.parse('20141028', 'yyyyMMdd'); // => 1414422000000
// 						var dateValue = dateUtil.parse('2014 10-28', 'yyyy MM-dd'); // => 1414422000000
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="long currentTimeMillis()">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>현재 시간을 long 형태의 시간 값으로 변환한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Returns long 타입의 시간값</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var currentTime = dateUtil.currentTimeMillis(); // => 1414460642364
// 					" />
// 				</ApiMethodBox>
// 			</ApiClassBox>
// 			<ApiClassBox apiClassName="DbHandler">
// 				<ApiMethodBox methodName="void update({ database(required), query(required) })">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>지정된 데이터베이스(database)에 대해 insert, update, delete query를 실행한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var database = {
// 						\tdriver: 'oracle.jdbc.driver.OracleDriver', //(required)
// 						\tconnUrl: 'jdbc:oracle:thin:@192.168.10.1:1521:spiderx', //(required)
// 						\tusername: 'admin', //(required)
// 						\tpassword: 'admin', //(required)
// 						\tisUserEncrypted: 'false' //(default: true)
// 						};
// 						dbHandler.update({database: database, query: 'delete from test_table'});
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="void batch({ database(required), queries(required) })">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>지정된 데이터베이스(database)에 대해 insert, update, delete query를 배치로 실행한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var database = {
// 						\tdriver: 'oracle.jdbc.driver.OracleDriver', //(required)
// 						\tconnUrl: 'jdbc:oracle:thin:@192.168.10.1:1521:spiderx', //(required)
// 						\tusername: 'admin', //(required)
// 						\tpassword: 'admin', //(required)
// 						\tisUserEncrypted: 'false' //(default: true)
// 						};
// 						dbHandler.update({
// 						\tdatabase: database,
// 						\tqueries: [
// 						\t\t'insert into test_table (col) values(\'test1\')', 
// 						\t\t'insert into test_table (col) values(\'test2\')',
// 						\t\t'insert into test_table (col) values(\'test3\')'
// 						\t] 
// 						});
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="void selectAndAppend({ database(required), query(required), delimiter(default: '|'), writer(required) })">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>지정된 데이터베이스(database)에 대해서 select 쿼리를 실행한 결과를 곧바로 파일로 출력한다. 출력되는 데이터들의 row간 구분자는 '\\n', column 간 구분자는 delimiter로 구성된다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var database = {
// 						\tdriver: 'oracle.jdbc.driver.OracleDriver', //(required)
// 						\tconnUrl: 'jdbc:oracle:thin:@192.168.10.1:1521:spiderx', //(required)
// 						\tusername: 'admin', //(required)
// 						\tpassword: 'admin', //(required)
// 						\tisUserEncrypted: 'false' //(default: true)
// 						};
// 						var writer = fileWriterFactory.getWriter({
// 						\tfilename: '/data/output.txt',
// 						\tcharset: 'utf8'
// 						});
// 						dbHandler.selectAndAppend({
// 						\tdatabase: database,
// 						\tquery: 'select * from test_table', //(required)
// 						\tdelimiter: '|', //(default '|')
// 						\twriter: writer //(required)
// 						});
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="void selectAndInsert({srcDatabase(required), selectQuery(required), destDatabase(required), insertQuery(required) })">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item></ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						dbHandler.selectAndInsert({
// 						\tsrcDatabase: {
// 						\t\tdriver: 'oracle.jdbc.driver.OracleDriver', //(required)
// 						\t\tconnUrl: 'jdbc:oracle:thin:@192.168.10.1:1521:spiderx', //(required)
// 						\t\tusername: 'admin', //(required)
// 						\t\tpassword: 'admin', //(required)
// 						\t\tisUserEncrypted: 'false' //(default: true)
// 						\t},
// 						\tselectQuery: 'select srcCol1, srcCol2, srcCol3 from test_src_table',
// 						\tdestDatabase: {
// 						\t\tdriver: 'oracle.jdbc.driver.OracleDriver', //(required)
// 						\t\tconnUrl: 'jdbc:oracle:thin:@192.168.10.100:1521:test', //(required)
// 						\t\tusername: 'admintest', //(required)
// 						\t\tpassword: 'admintest', //(required)
// 						\t\tisUserEncrypted: 'false' //(default: true)
// 						\t},
// 						\tinsertQuery: 'insert into test_dest_table (destCol1, destCol2, destCol3) values(?, ?, ?)'
// 						});
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="String query({ database(required), query(required), delimiter(default: '|'), lineDelimiter(default: '\n')">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>지정된 데이터베이스(database)에 대해서 select 쿼리를 실행한 결과를 String 형식으로 반환한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						dbHandler.query({
// 						\tdatabase: {
// 						\t\tdriver: 'oracle.jdbc.driver.OracleDriver', //(required)
// 						\t\tconnUrl: 'jdbc:oracle:thin:@192.168.10.1:1521:spiderx', //(required)
// 						\t\tusername: 'admin', //(required)
// 						\t\tpassword: 'admin', //(required)
// 						\t\tisUserEncrypted: 'false' //(default: true)
// 						\t},
// 						\tquery: 'select * from test_table', //(required)
// 						\tdelimiter: '||', //(default '|')
// 						\tlineDelimiter: '\n' //(default '\n')
// 						});
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="void queryCallback({ database(required), query(required), callback(required) })">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>지정된 데이터베이스(database)에 대해서 select 쿼리를 실행한 후에 결과 세트를 callback 함수를 이용하여 처리한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						dbHandler.queryCallback({
// 						\tdatabase: {
// 						\t\tdriver: 'oracle.jdbc.driver.OracleDriver', //(required)
// 						\t\tconnUrl: 'jdbc:oracle:thin:@192.168.10.1:1521:spiderx', //(required) 
// 						\t\tusername: 'admin', //(required) 
// 						\t\tpassword: 'admin', //(required) 
// 						\t\tisUserEncrypted: 'false' //(default: true) 
// 						\t},
// 						\tquery: 'select idCol, valueCol from test_table',
// 						\tcallback: function(resultset) { 
// 						\t\tif(resultset.getString('idCol') !== 'test') {
// 						\t\t\tlogger.info('filtered value: ' + resultset.getString('valueCol'));
// 						\t\t}
// 						\t}
// 						});
// 					" />
// 				</ApiMethodBox>
// 			</ApiClassBox>
// 			<ApiClassBox apiClassName="fileReaderFactory">
// 				<ApiMethodBox methodName="FileReader getReader({ filename(required), deleteExpiredFile(default: false), charset(default: utf8), timeAdjustSec(default: 0) })">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>지정된 filename을 읽는 FileReader 객체를 반환한다. filename에는 날짜 지정자($yyyy, $mm, $dd, $hh, $mi, $ss)를 지정할 수 있다. </ApiMethodBox.Item>
// 						<ApiMethodBox.Item>읽은 파일들을 삭제하려면 deleteExpiredFile: true, 캐릭터 셋을 지정하려면 charset: charset, 날짜 지정자 기준 시간보다 미래/과거의 파일을 읽으려면 timeAdjustSec을 설정해준다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var fileReader = fileReaderFactory.getReader({
// 						\tfilename: '/data/E_$yyyy$mm$dd$hh.stmp' //required
// 						});
// 					" />
// 				</ApiMethodBox>
// 			</ApiClassBox>
// 			<ApiClassBox apiClassName="fileReader">
// 				<ApiMethodBox methodName="String readLine()">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>파일에서 한 줄을 읽는다. 더이상 읽을 라인이 없을 경우 null을 반환한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var fileReader = fileReaderFactory.getReader({
// 						\tfilename: '/data/E_$yyyy$mm$dd$hh.stmp' //required
// 						});
// 						var line = fileReader.readLine();
// 						logger.info(line);
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="void registerListener(callback)">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>file에 새로운 line이 append 될 경우 호출될 listener callback을 등록한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var fileReader = fileReaderFactory.getReader({
// 						\tfilename: '/data/E_$yyyy$mm$dd$hh.stmp' //required
// 						});
// 						fileReader.registerListener(function(line) {
// 						\tlogger.info(line);
// 						});
// 					" />
// 				</ApiMethodBox>
// 			</ApiClassBox>
// 			<ApiClassBox apiClassName="fileWriterFactory">
// 				<ApiMethodBox methodName="FileWriter getWriter({ filename(required), charset(default: 'utf8') })">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>filename에 데이터를 쓰는 FileWriter 객체를 반환한다. filename에는 날짜 지정자($yyyy, $mm, $dd, $hh, $mi, $ss)를 지정할 수 있다. </ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var fileWriter = fileWriterFactory.getWriter({
// 						\tfilename: '/data/$yyyy$mm$dd$hh.txt'
// 						});
// 					" />
// 				</ApiMethodBox>
// 			</ApiClassBox>
// 			<ApiClassBox apiClassName="fileWriter">
// 				<ApiMethodBox methodName="void print(msg)">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>file에 msg를 기록한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var fileWriter = fileWriterFactory.getWriter({
// 						\tfilename: '/data/$yyyy$mm$dd$hh.txt'
// 						});
// 						fileWriter.print('test');
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="void println(msg)">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>file에 line feed를 포함한 msg를 기록한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var fileWriter = fileWriterFactory.getWriter({
// 						\tfilename: '/data/$yyyy$mm$dd$hh.txt'
// 						});
// 						fileWriter.println('test');
// 					" />
// 				</ApiMethodBox>
// 			</ApiClassBox>
// 			<ApiClassBox apiClassName="runtimeUtil">
// 				<ApiMethodBox methodName="void sleep(timeMillis)">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>지정된 밀리초만큼 멈춘다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						runtimeUtil.sleep(1000);
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="String exec(cmd)">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>시스템 명령어를 실행한 뒤에 그 결과를 반환한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var result = runtimeUtil.exec('ls -al');
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="void execAsync(cmd)">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>시스템 명령어를 실행한 뒤에 결과를 기다리지 않고 바로 반환한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						runtimeUtil.execAsyn('mkdir /data');
// 					" />
// 				</ApiMethodBox>
// 				<ApiMethodBox methodName="String getVersion()">
// 					<ApiMethodBox.ItemList>
// 						<ApiMethodBox.Item>버전 정보를 출력한다.</ApiMethodBox.Item>
// 						<ApiMethodBox.Item>Example</ApiMethodBox.Item>
// 					</ApiMethodBox.ItemList>
// 					<ApiMethodBox.Example value="
// 						var version = runtimeUtil.getVersion();
// 						logger.info('version: ' + version);
// 					" />
// 				</ApiMethodBox>
// 			</ApiClassBox>
// 		</ApiView>
// 	</Layout>, 
// 	document.body);