
import csv

f1 = open("/home/geo/Desktop/21_final_processed_mature.fa.txt")
data = csv.reader(f1 , delimiter="	")
f2 = open("/home/geo/Desktop/processed_miR_Family_Info.txt.csv")
data2 = csv.reader(f2 , delimiter="	")

file_object = open('mimat_seq_combined_miRNA_info_21.txt.csv', 'w' )

#an exoun idio mimat kai idia sequence , merge

k = 0
#bike = 0
for row in data:
	for row2 in data2:
		if row[1] == row2[6]:
			if row[2] == row2[4]:
				bike = 1
				k = k+1
				element = row[0] + '\t' + row[1] + '\t' + row[2] + '\t' + row2[0] + '\t'+  row2[1] + '\n'
				file_object.write(element)
				break
	f2.seek(0)
	#if bike == 1:
	#	bike = 0
	#else:
	#	print row[0]
print k
