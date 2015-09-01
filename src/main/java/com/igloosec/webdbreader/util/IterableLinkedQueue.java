package com.igloosec.webdbreader.util;

import java.util.ArrayList;
import java.util.Iterator;

public class IterableLinkedQueue<T> {
	private Node<T> head;
	private Node<T> tail;
	private final int capacity;
	private int currentSize = 0;
	private Object modifyLock = new Object();

	public IterableLinkedQueue(int capacity) {
		if(capacity <= 0)
			capacity = 1;
		this.capacity = capacity;
	} // INIT
	
	public static IterableLinkedQueue newQueue(int capacity) {
		return new IterableLinkedQueue(capacity);
	} //newQueue

	public void push(T value) {
		synchronized (modifyLock) {
			try {
				Node node = new Node(value);
				currentSize++;

				if(tail != null) {
					tail.setNext(node);
					tail = node;
					return;
				} //if
				
				head = node;
				tail = node;
			} finally {
				checkSize();
			} //finally
		} //sync
	} //addLast

	public int size() {
		return currentSize;
	} //size
	
	private void checkSize() {
		if(currentSize > capacity) {
			head = head.getNext();
			currentSize--;
		} //if
	} //checkSize
	
	public Iterator<T> iterator() {
		return new Iter();
	} //iterator
	
	@Override
	public String toString() {
		ArrayList<T> list = new ArrayList<T>();
		Iterator<T> iter = iterator();
		T value = null;
		
		while(( value = iter.next() ) != null)
			list.add(value);
		
		return list.toString();
	} //toString

	class Node<T> {
		private T data;
		private Node<T> next;

		public Node(T data) {
			this.data = data;
		} //INIT

		public T getData() {
			return data;
		}

		public void setData(T data) {
			this.data = data;
		}

		public Node<T> getNext() {
			return next;
		}

		public void setNext(Node<T> next) {
			this.next = next;
		}
	} // class
	
	class Iter implements Iterator<T> {
		private Node<T> node;
		
		Iter() {
		} //INIT

		@Override
		public boolean hasNext() {
			synchronized (modifyLock) {
				if(this.node == null) {
					if(head == null)
						return false;
					return true;
				} //if

				return node.getNext() != null;
			} //sync
		} //hasNext

		@Override
		public T next() {
			synchronized (modifyLock) {
				if(this.node == null) {
					if(head == null)
						return null;
					this.node = (Node<T>) head;
					return node.getData();
				} //if

				if(hasNext() == false)
					return null;
				node = node.getNext();
				return node.getData();
			} //sync
		} //next

		@Override
		public void remove() {
			// not used method
		} //remove
	} //class
} // class