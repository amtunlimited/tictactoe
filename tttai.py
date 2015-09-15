#tttai.py: A simple Tic Tac Toe AI using the Minimax algorithm.
#Written by: Aaron Tagliaboschi <aaron.tagliaboschi@gmail.com>

#Note: board layout is left to right, top to bottom
#	  0 | 1 | 2  
#	----+---+---+
#	  3 | 4 | 5  
#	----+---+----
#	  6 | 7 | 8

#This is a list of all win conditions in Tic Tac Toe
win = [
	[0,1,2], #Horizontal
	[3,4,5],
	[6,7,8],
	[0,3,6], #Vertical
	[1,4,7],
	[2,5,8], 
	[0,4,8], #Across
	[2,4,6]
]

#Conversion
def conv(board):
	"""Conv converts the strings fed in into a usable board"""
	convd = {
		"x": 1,
		"o": -1,
		"b": 0
	}
	
	return map(lambda a: convd[a], list(board))

def score(board):
	"""This is the "score" algorithm for the minimax.
	
	Returns '1' if the computer won and '-1' if the player won. 0 otherwise."""
	#note, possible answer for tie?
	for con in win:
		#if all three of a win conndition match and aren't 0
		if(board[con[0]] == board[con[1]] and
		   board[con[1]] == board[con[2]] and
		   board[con[0]]): #'0' is false in python
			return board[con[0]] * 10
	return 0

def tie(board):
	"""This just checks if the board is filled up or not"""
	for i in xrange(9):
		if(board[i] == 0):
			return False
	
	return True

def bestMove(board, turn):
	"""This is the minimax function itself.
	
	It recursively searches for moves that give the computer the highest score, 
	assuming the player is also using the highest score.
	"""
	
	best = score(board)
	
	#return the score if it's not 0
	if(best):
		return best
	
	if(tie(board)):
		return 0
	
	#Make the 'best' arbitrarily hi or low so this can never actually be the best.	
	best = -1 * turn * 1000
	
	#Find every blank, return the solution if a move is placed there
	for i in xrange(9):
		if(not board[i]):
			board[i] = turn
			#Recurse. Subtract one to penalize draging out the game.
			answer = bestMove(board, -1 * turn, ) - 1
			board[i] = 0
			#Multipling by -1 is the same as changing the < to a >. This makes
			#the "minimax" protion of the algorithm
			if((turn==1 and best < answer) or (turn==-1 and best > answer)):
				best = answer
	return best

def comMove(board):
	"""comMove decides what the best move for play '1' is given a starting board
	
	Note: This function is basically the same as bestMove, but it tracks player
	'1' only, and it tracks the *move* with the best score, not the best score 
	itself.
	"""
	best = score(board)
	move = 10
	
	if(best):
		return best
	
	best = -1000
	
	for i in xrange(9):
		if(not board[i]):
			board[i]=1
			answer = bestMove(board, -1,1)
			board[i]=0
			if(best < answer):
				best = answer
				move = i
	
	return move