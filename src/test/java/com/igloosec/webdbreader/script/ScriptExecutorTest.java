package com.igloosec.webdbreader.script;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.junit.Test;

import sun.org.mozilla.javascript.internal.CompilerEnvirons;
import sun.org.mozilla.javascript.internal.Parser;
import sun.org.mozilla.javascript.internal.ast.AstNode;
import sun.org.mozilla.javascript.internal.ast.AstRoot;
import sun.org.mozilla.javascript.internal.ast.Name;
import sun.org.mozilla.javascript.internal.ast.NodeVisitor;
import sun.org.mozilla.javascript.internal.ast.StringLiteral;
import sun.org.mozilla.javascript.internal.ast.Symbol;
import sun.org.mozilla.javascript.internal.ast.VariableDeclaration;

public class ScriptExecutorTest {
	@Test
	public void test() throws FileNotFoundException, IOException {
//		String script = IOUtils.toString(new FileInputStream(new File("d:\\tmp\\tmp\\tmp.js")));
//		String script = "var blabla = 111;";
		String script = "var sdf = 'asdf';";
		
		CompilerEnvirons env = new CompilerEnvirons();
		env.setRecordingLocalJsDocComments(true);
		env.setAllowSharpComments(true);
		env.setRecordingComments(true);
		AstRoot node = new Parser(env).parse(script, "test.js", 1);
		
		List<Symbol> list = node.getSymbols();
		for(Symbol symbol : list) {
			System.out.println(symbol.getName());
		}
		
		node.visitAll(new NodeVisitor() {
			@Override
			public boolean visit(AstNode node) {
				System.out.println(node.getClass().toString());
				if(node.getClass().equals(StringLiteral.class)) {
					StringLiteral sl = (StringLiteral) node;
					System.out.println(sl.getValue(false));
				}
				return true;
			}
		});
	}
}