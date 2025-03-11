from bs4 import BeautifulSoup
import requests
import logging
from typing import Dict, List,Optional,Tuple
from pydantic import BaseModel,Field
from requests.exceptions import RequestException
logger = logging.getLogger(__name__)

class JobDetails(BaseModel):
    job_title:str
    job_location: str
    post_date: str
    job_desc_link: str
    job_summary :List[str] = Field(default_factory=list)
    responsibilities: List[str] =Field(default_factory=list)
    class Config:
        frozen = True
class JobParse:
    _BASE_URL = "https://myjobo.com/search-jobs"
    _JOB_CARD_SELECTOR = "div.job-card"
    _NO_RESULTS_SELECTOR = "div.col-md-12.text-center.text-gray"
    _JOB_TITLE_SELECTOR = "h5.card-title.text-secondary.fs-18.mb-0"
    _LOCATION_SELECTOR = "div.desc.d-flex.me-4 p.fs-14.text-gray.mb-2"
    _POST_DATE_SELECTOR = "div.desc.d-flex p.fs-14.text-gray.mb-2"
    _JOB_LINK_SELECTOR = "a.card.py-30.border-0"
    _RESPONSIBILITIES_SELECTOR = "div.key-responsibilities"
    def __init__(self,position:str):
        self.position = position.strip().lower()
        self.job_results: Optional[List[JobDetails]] = None
    async def search_for_jobs(self) -> List[JobDetails]:
        try:
            html = self._fetch_search_results()
            self.job_results = self._parse_search_results(html)
            return self.job_results
        except Exception as e:
            logger.error(f"Job search failed: {str(e)}")
            raise
    def _fetch_search_results(self) -> str:
        # params = {"keywords": self.position.replace(" ", "+")}
        url = f"{self._BASE_URL}?keywords={self.position.replace(' ', '+')}"
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.text
        except RequestException as e:
            logger.error(f"Request failed: {str(e)}")
            raise
    def _parse_search_results(self, html: str) -> List[JobDetails]:
        soup = BeautifulSoup(html, "lxml")
        if self._check_no_results(soup):
            return [JobDetails(
                job_title="",
                job_location="",
                post_date="",
                job_desc_link="",
                job_summary = [],
                responsibilities=[f"No vacancy found for {self.position} position"]
            )]
        jobs = []
        for card in soup.select(self._JOB_CARD_SELECTOR):
            try:
                job = self._parse_job_card(card)
                if job:
                    jobs.append(job)
            except Exception as e:
                logger.warning(f"Failed to parse job card: {str(e)}")
        
        return jobs
    def _check_no_results(self, soup: BeautifulSoup) -> bool:
        no_results = soup.select_one(self._NO_RESULTS_SELECTOR)
        return no_results and "No job vacancies" in no_results.text

    def _parse_job_card(self, card: BeautifulSoup) -> Optional[JobDetails]:
        job_div = card.select_one("div", class_="job-card")
        if not job_div:
            return None
        summary, responsibilities = self._get_responsibilities(job_div)
        return JobDetails(
            job_title=self._safe_select_text(job_div, self._JOB_TITLE_SELECTOR),
            job_location=self._get_job_location(job_div, self._LOCATION_SELECTOR),
            post_date=self._safe_select_text(card, self._POST_DATE_SELECTOR),
            job_desc_link=self._get_job_description_link(job_div),
            job_summary=summary,
            responsibilities=responsibilities
        )

    @staticmethod
    def _safe_select_text(soup: BeautifulSoup, selector: str) -> str:
        element = soup.select_one(selector)
        return element.text.strip() if element else ""
    @staticmethod
    def _get_job_location(soup:BeautifulSoup, selector) -> str:
        element = soup.select(selector)
        return element[-1].text.strip() if element else ""
    def _get_job_description_link(self, job_div: BeautifulSoup) -> str:
        link_tag = job_div.select_one(self._JOB_LINK_SELECTOR)
        return link_tag['href'].strip() if link_tag and 'href' in link_tag.attrs else ""

    def _get_responsibilities(self, job_div: BeautifulSoup) -> Tuple[List[str], List[str]]:
        link = self._get_job_description_link(job_div)
        if not link:
            return []
        try:
            html = requests.get(link, timeout=10).text
            soup = BeautifulSoup(html, "lxml")
            responsibilities = []
            responsibilities_div = soup.select_one(self._RESPONSIBILITIES_SELECTOR)
            if responsibilities_div:
                p_tags = responsibilities_div.find_all("p")
                for element in p_tags:
                    text = element.get_text(strip=True)
                    if text:
                        cleaned_text = text.replace("\xa0", " ").replace("• ", "- ")
                        responsibilities.append(cleaned_text)
            else :
                return []
            job_summary_div = soup.find("div", class_="Job Description mb-lg-5 mb-4")
            summary_p = job_summary_div.find_all("p")
            job_summary = []
            if summary_p:
                for element in summary_p:
                    text = element.get_text(strip=True)
                    if text:
                        cleaned_text = text.replace("\xa0", " ").replace("• ", "- ")
                        job_summary.append(cleaned_text)
            return job_summary, responsibilities
        except RequestException as e:
            logger.warning(f"Failed to fetch job description: {str(e)}")
        
        