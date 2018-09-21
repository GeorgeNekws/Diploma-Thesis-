
import csv 

data = csv.reader(open("/home/geo/Downloads/last2_mart_export.txt.csv"),delimiter="	")
#file_object = open('3_biomart_results_only_protein_coding.csv', 'w' )
file_object = open('4_biomart_results_only_protein_coding.csv', 'w' )

lista = []
for i in range(1,23):
	lista.append(str(i))
lista.append('X')
lista.append('Y')
print lista

# to arxeio na min periexei xrwmosomata 'patch'
for row in data:
	if(row[17] == 'protein_coding' and (row[2] in lista) ):		
		if( row[9] =='' and row[10] =='' and row[11] =='' and row[12] =='' and row[15] =='' and row[16] =='' ):
			continue
		else:	
			element = row[0] + '\t' + row[1] + '\t' + row[7] + '\t' + row[9] + '\t' + row[10] + '\t' + row[11] + '\t' + row[12] + '\t' +\
			row[15] + '\t' + row[16] + '\n'
			file_object.write(element)
			'''element = row[0] + '\t' + row[1] + '\t' + row[2] + '\t' + row[3] + '\t' + row[4] + '\t' + row[5] + '\t' + row[6] + '\t' +\
			row[7] + '\t' + row[8] + '\t' + row[9] + '\t' + row[10] + '\t' + row[11] + '\t' + row[12] + '\t' + row[13] + '\t' +\
			row[14] + '\t' + row[15] + '\t' + row[16] + '\n' 
			file_object.write(element)'''


file_object.close()
