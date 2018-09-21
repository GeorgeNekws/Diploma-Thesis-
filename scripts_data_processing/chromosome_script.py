
import csv 

data = csv.reader(open("/home/geo/Desktop/ideogram_9606_GCF_000001305.13_850_V1.csv"),delimiter="	")
file_object = open('proc_ideogram_9606_GCF_000001305.13_850_V1.csv', 'w' )


for row in data:
			
		element = row[0] + '\t' + row[1] + '\t' + row[2] + '\t' + row[5] + '\t' + row[6] + '\t' + row[7] + '\t' + row[8] + '\n' 
		file_object.write(element)

file_object.close()
