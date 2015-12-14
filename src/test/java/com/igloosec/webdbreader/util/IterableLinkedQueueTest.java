package com.igloosec.webdbreader.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.Iterator;

import org.junit.Test;

import com.igloosec.scripter.util.IterableLinkedQueue;

public class IterableLinkedQueueTest {

	@Test
	public void capacity_test() {
		final int CAPACITY = 3;
		IterableLinkedQueue<String> queue = IterableLinkedQueue.newQueue(CAPACITY);
		for (int i = 1; i <= 5; i++)
			queue.push(String.valueOf(i));
		assertEquals(queue.size(), CAPACITY);
	} //test
	
	@Test
	public void iterator_test() {
		final int CAPACITY = 5;
		IterableLinkedQueue<String> queue = IterableLinkedQueue.newQueue(CAPACITY);
		Iterator<String> iter = queue.iterator();
		for (int i = 1; i <= CAPACITY; i++)
			queue.push(String.valueOf(i));
		
		for (int i = 1; i <= CAPACITY; i++) {
			assertTrue(iter.hasNext());
			assertEquals(iter.next(), String.valueOf(i));
		} //for i
		
		assertFalse(iter.hasNext());
		assertNull(iter.next());
	} //iterator_test
	
	@Test
	public void multithread_test() {
		final int CAPACITY = 5;
		final IterableLinkedQueue<String> queue = IterableLinkedQueue.newQueue(CAPACITY);
		
		new Thread() {
			@Override
			public void run() {
				for (int i = 1; i <= CAPACITY; i++) {
					queue.push(String.valueOf(i));
					threadSleep(500);
				} //for i
			} //run
		}.start();
		
		Iterator<String> iter = queue.iterator();
		for(;;) {
			threadSleep(200);
			if(iter.hasNext()) {
				String value = iter.next();
				if(value.equals(String.valueOf(CAPACITY)))
					return;
			} //if
		} //for ;;
	} //multithread_test
	
	private void threadSleep(long millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			e.printStackTrace();
			fail();
		} //catch
	} //sleep
} //class