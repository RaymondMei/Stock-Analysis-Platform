from rest_framework.decorators import api_view
from rest_framework.response import Response
import os

from fpdf import FPDF

# Create your views here.
@api_view(['GET'])
def generatePDF(request):
	if request.method == 'GET':
		output_path = os.path.join(os.path.abspath(os.getcwd()), "performance_report.pdf")
		print(output_path)
		pdf = FPDF(orientation='P', unit='mm', format='A4')
		pdf.add_page()
		pdf.set_font("Arial", size = 12)
		pdf.cell(200, 10, txt = "Stock Performance Report", ln = True, align = 'C')
		
		pdf.output(output_path)
		return Response({'message': 'Hello, you\'re at the reportgeneration index.'})