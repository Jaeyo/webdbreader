var React = require('react'),
	ReactDOM = require('react-dom'),
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

module.exports = ApiView;