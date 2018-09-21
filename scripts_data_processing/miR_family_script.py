
import csv 

data = csv.reader(open("files downloaded/miR_Family_Info.txt"),delimiter="	")
file_object = open('processed_miR_Family_Info.txt.csv', 'w' )

for row in data:
	if(row[2] == '9606'):	
				
		element = row[0] + '\t' + row[1] + '\t' + row[2] + '\t' + row[3] + '\t' + row[4] + '\t' + row[5] + '\t' + row[6] + '\n' 
		file_object.write(element)


file_object.close()
