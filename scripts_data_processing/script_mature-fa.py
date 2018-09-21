# script for mature.fa file to extract only homo_sapiens info
# to xrisimopoiw

import csv

file_object = open('files downloaded/mature.fa', 'r' )
file_object2 = open('files downloaded/middle_processed_mature.fa.txt', 'w' )
file_object3 = open('files downloaded/final_processed_mature.fa.txt', 'w' )

#remove ">" from the start of line
#remove "\n" from the end and also remove substr "Homo sapiens " 
line = file_object.readline().rstrip('\n').strip('>').replace('Homo sapiens ', '')

while line:
	#print line
	if "hsa" in line:
		file_object2.write(line)
		file_object2.write(' ' + file_object.readline())
	
	line = file_object.readline().rstrip('\n').strip('>').replace('Homo sapiens ', '')
	

file_object.close()
file_object2.close()

###########################################
# second part of processing: take out the microRNA name from each line that does not begin with hsa-... 

data = csv.reader(open('files downloaded/middle_processed_mature.fa.txt'),delimiter=" ")

for row in data:
	file_object3.write(row[0] + '\t' + row[1] + '\t' + row[3] + '\n')
